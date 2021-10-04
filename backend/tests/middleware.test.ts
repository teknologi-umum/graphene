import { test } from 'uvu';
import request from 'supertest';
import server from '../src/index';

const instance = request(server.handler);

test.only('should pass cors options', async () => {
  await instance.options('/api').expect(204);
});

test('should error when json is invalid', async () => {
  await instance
    .post('/api')
    .send(`{"code": "some random text, "format": "jpeg"}`)
    .expect(400)
    .expect('content-type', 'application/json');
});

test.run();
