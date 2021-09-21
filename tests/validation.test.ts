import { test } from 'uvu';
import request from 'supertest';
import server from '../src/index';

const instance = request(server.handler);

test('should error when body is empty', async () => {
  await instance.post('/api').send({}).expect(400).expect('content-type', 'application/json');
});

test('should error without a code', async () => {
  await instance
    .post('/api')
    .send({ lang: 'javascript' })
    .expect(400)
    .expect('content-type', 'application/json')
    .expect({ msg: ['`code` is required!'] });
});

test('should error with bad format', async () => {
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

test('should error when invalid font was given', async () => {
  await instance
    .post('/api')
    .send({
      font: 'asd',
      code: "console.log('foo')",
    })
    .expect(400)
    .expect('content-type', 'application/json')
    .expect({ msg: ['Bad `font`! Valid options are `sf mono`, `jetbrains mono`, and `fira code`'] });
});

test('what if we had multiple errors?', async () => {
  await instance
    .post('/api')
    .send({
      font: 'asd',
      format: 'qwe',
      theme: 'something else',
      upscale: -5,
      code: '',
    })
    .expect(400)
    .expect('content-type', 'application/json')
    .expect({
      msg: [
        '`code` is required!',
        "`upscale` can't be lower than 1!",
        'Bad `format`! Valid options are `png`, `jpeg`, and `webp`',
        'Bad `theme`! See https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes for list of valid themes',
        'Bad `font`! Valid options are `sf mono`, `jetbrains mono`, and `fira code`',
      ],
    });
});

test.run();
