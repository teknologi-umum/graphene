import { test } from 'uvu';
import request from 'supertest';
import server from '../src/index';

const instance = request(server.handler);

test('should output png', async () => {
  await instance
    .post('/api')
    .send({ code: "console.log('foo');", format: 'png' })
    .expect(200)
    .expect('content-type', 'image/png');
});

test('should output jpeg', async () => {
  await instance
    .post('/api')
    .send({ code: "console.log('foo');", format: 'jpeg' })
    .expect(200)
    .expect('content-type', 'image/jpeg');
});

test('should output webp', async () => {
  await instance
    .post('/api')
    .send({ code: "console.log('foo');", format: 'webp' })
    .expect(200)
    .expect('content-type', 'image/webp');
});

test('should output svg', async () => {
  await instance
    .post('/api')
    .send({ code: "console.log('foo');", format: 'svg' })
    .expect(200)
    .expect('content-type', 'image/svg+xml');
});

test.run();
