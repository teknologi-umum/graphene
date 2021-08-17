import { test } from 'uvu';
import request from 'supertest';
import server from './index.js';
import { readFile } from 'fs/promises';

const instance = request(server.handler);

test('should serve a view', async () => {
  await instance.get('/').expect(200, await readFile('./static/index.html', 'utf-8'));
});

test('should pass cors options', async () => {
  await instance.options('/').expect(204);
});

test('should error when body is empty', async () => {
  await instance.post('/api/shot').send({}).expect(400);
});

test('should error without a code', async () => {
  await instance
    .post('/api/shot')
    .send(JSON.stringify({ lang: 'javascript', username: 'breathing_human_iii' }))
    .expect(400)
    .expect('content-type', 'application/json')
    .expect({ msg: ['`code` is required!'] });
});

test('should error without a username', async () => {
  await instance
    .post('/api/shot')
    .send({ body: JSON.stringify({ code: 'console.log("sup world")', lang: 'javascript' }) })
    .expect(400)
    .expect('content-type', 'application/json')
    .expect({ msg: ['`code` is required!', '`username` is required!'] });
});

test('should error without a username *and* code', async () => {
  await instance
    .post('/api/shot')
    .send(JSON.stringify({ lang: 'javascript' }))
    .expect(400)
    .expect('content-type', 'application/json')
    .expect({ msg: ['`code` is required!', '`username` is required!'] });
});

test('should error with bad format ', async () => {
  await instance
    .post('/api/shot')
    .send(JSON.stringify({ lang: 'javascript', code: "console.log('foo')", username: 'manusia', format: 'asdf' }))
    .expect(400)
    .expect('content-type', 'application/json')
    .expect({ msg: ['Bad `format`! Valid options are `oxipng` and `mozjpg`'] });
});

test('should generate a png image', async () => {
  await instance
    .post('/api/shot')
    .send(JSON.stringify({ code: 'console.log("sup world")', lang: 'javascript', username: 'breathing_human_iii' }))
    .expect(200)
    .expect('content-type', 'image/png');
});

// workaround to close puppeteer since we only use a single instance for each
// session instead of spawning for each request
test.after(async () => {
  setTimeout(() => process.exit(0), 1000);
});

test.run();
