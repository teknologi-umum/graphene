// import { browser } from './utils/browser.js';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { makeFetch } from 'supertest-fetch';
import server from './index.js';

const fetch = makeFetch(server);

test('should pass cors options', async () => {
  await fetch('/', { method: 'OPTIONS' }).expectStatus(204).end();
});

test('should be error without a code', async () => {
  await fetch('/', {
    method: 'POST',
    body: JSON.stringify({ lang: 'javascript', username: 'breathing_human_iii' }),
  })
    .expectStatus(400)
    .expectHeader('content-type', 'application/json')
    .expectBody({ msg: '`code` body parameter is required!' })
    .end();
});

test('should be error without a language', async () => {
  await fetch('/', {
    method: 'POST',
    body: JSON.stringify({ code: 'console.log("sup world")', username: 'breathing_human_iii' }),
  })
    .expectStatus(400)
    .expectHeader('content-type', 'application/json')
    .expectBody({ msg: '`lang` body parameter is required!' })
    .end();
});

test('should be error without a username', async () => {
  await fetch('/', {
    method: 'POST',
    body: JSON.stringify({ code: 'console.log("sup world")', lang: 'javascript' }),
  })
    .expectStatus(400)
    .expectHeader('content-type', 'application/json')
    .expectBody({ msg: '`username` body parameter is required!' })
    .end();
});

test('should be error without a username *and* code', async () => {
  await fetch('/', {
    method: 'POST',
    body: JSON.stringify({ lang: 'javascript' }),
  })
    .expectStatus(400)
    .expectHeader('content-type', 'application/json')
    .expectBody({ msg: '`code` + `username` body parameter is required!' })
    .end();
});

test('should be error without anything', async () => {
  await fetch('/', {
    method: 'POST',
    body: JSON.stringify({}),
  })
    .expectStatus(400)
    .expectHeader('content-type', 'application/json')
    .expectBody({ msg: '`code` + `lang` + `username` body parameter is required!' })
    .end();
});

test('should generate a png image', async () => {
  const response = await fetch('/', {
    method: 'POST',
    body: JSON.stringify({ code: 'console.log("sup world")', lang: 'javascript', username: 'breathing_human_iii' }),
  }).end();
  assert.equal(response.status, 200);
  assert.not.equal(response.headers.get('content-length'), '0');
  assert.equal(response.headers.get('content-type'), 'image/png');
});

// TODO: ngestuck
// test.after(async () => {
//   const b = await browser.get();
//   const pages = await b.pages();
//   await Promise.all(pages.map((page) => page.close()));
//   await b.close();
// });

test.run();
