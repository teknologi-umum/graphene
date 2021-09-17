import { readFile } from 'fs/promises';
import { test } from 'uvu';
import request from 'supertest';
import server from '../src/index.js';

const instance = request(server.handler);

test('should serve a view', async () => {
  await instance
    .get('/')
    .expect(200, await readFile('./src/static/index.html', 'utf-8'))
    .expect('content-type', 'text/html');
});

test('should pass cors options', async () => {
  await instance.options('/').expect(204);
});

test('should error when body is empty', async () => {
  await instance.post('/api').send({}).expect(400).expect('content-type', 'application/json');
});

test('should error when json is invalid', async () => {
  await instance
    .post('/api')
    .send(`{"code": "some random text, "format": "jpeg"}`)
    .expect(400)
    .expect('content-type', 'application/json');
});

test('should error without a code', async () => {
  await instance
    .post('/api')
    .send({ lang: 'javascript' })
    .expect(400)
    .expect('content-type', 'application/json')
    .expect({ msg: ['`code` is required!'] });
});

test('should error with bad format ', async () => {
  await instance
    .post('/api')
    .send({
      lang: 'javascript',
      code: "console.log('foo')",
      format: 'asdf',
    })
    .expect(400)
    .expect('content-type', 'application/json')
    .expect({ msg: ['Bad `format`! Valid options are `png`, `jpeg`, and `webp`'] });
});

test('should generate a png image', async () => {
  await instance
    .post('/api')
    .send({
      code: 'console.log("sup world")',
      lang: 'javascript',
    })
    .expect(200)
    .expect('content-type', 'image/png');
});

test('should guess the language', async () => {
  await instance
    .post('/api')
    .send({
      code: 'console.log("sup world")',
    })
    .expect(200)
    .expect('content-type', 'image/png');
});

test('should use the fallback language the language', async () => {
  await instance
    .post('/api')
    .send({
      code: 'something something',
    })
    .expect(200)
    .expect('content-type', 'image/png');
});

test('should generate an upscaled jpeg image', async () => {
  await instance
    .post('/api')
    .send({
      code: 'console.log("sup world")',
      lang: 'javascript',
      upscale: 1.5,
      format: 'jpeg',
    })
    .expect(200)
    .expect('content-type', 'image/jpeg');
});

test('should error when upscale is lower than 1', async () => {
  await instance
    .post('/api')
    .send({
      code: 'console.log("sup world")',
      lang: 'javascript',
      upscale: -22,
      format: 'jpeg',
    })
    .expect(400)
    .expect('content-type', 'application/json')
    .expect({ msg: ["`upscale` can't be lower than 1!"] });
});

test('should error when upscale is 0', async () => {
  await instance
    .post('/api')
    .send({
      code: 'console.log("sup world")',
      lang: 'javascript',
      upscale: 0,
      format: 'jpeg',
    })
    .expect(400)
    .expect('content-type', 'application/json')
    .expect({ msg: ["`upscale` can't be lower than 1!"] });
});

test('should error when upscale is not a number', async () => {
  await instance
    .post('/api')
    .send({
      code: 'console.log("sup world")',
      lang: 'javascript',
      upscale: 'asdf',
      format: 'jpeg',
    })
    .expect(400)
    .expect('content-type', 'application/json')
    .expect({ msg: ['`upscale` must be a number!'] });
});

test('should error when theme does not exists', async () => {
  await instance
    .post('/api')
    .send({
      code: 'console.log("sup world")',
      lang: 'javascript',
      format: 'jpeg',
      theme: 'foobar',
    })
    .expect(400)
    .expect('content-type', 'application/json')
    .expect({
      msg: [
        'Bad `theme`! See https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes for list of valid themes',
      ],
    });
});

// workaround to close puppeteer since we only use a single instance for each
// session instead of spawning for each request
test.after(() => {
  setTimeout(() => process.exit(0), 1000);
});

test.run();
