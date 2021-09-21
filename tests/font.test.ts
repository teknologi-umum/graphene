import { test } from 'uvu';
import * as assert from 'uvu/assert';
import request from 'supertest';
import server from '../src/index';
import { getFontSetup } from '../src/logic/getFontSetup';

const instance = request(server.handler);

test('return font setup for jetbrains mono', () => {
  const output = getFontSetup('jetbrains mono');
  assert.equal(output, {
    fontFamily: 'JetBrainsMono Nerd Font',
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 8.4,
  });
});

test('return font setup for sf mono', () => {
  const output = getFontSetup('sf mono');
  assert.equal(output, {
    fontFamily: 'SFMono Nerd Font',
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 8.65,
  });
});

test('return font setup for fira code', () => {
  const output = getFontSetup('fira code');
  assert.equal(output, {
    fontFamily: 'FiraCode Nerd Font',
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 8.65,
  });
});

test('should throw error on invalid font', () => {
  // @ts-expect-error test purposes
  assert.throws(() => getFontSetup('asd'), 'invalid font was given');
});

test('should be able to specify font options - jetbrains mono', async () => {
  await instance
    .post('/api')
    .send({ code: 'console.log("sup world");', font: 'jetbrains mono' })
    .expect(200)
    .expect('content-type', 'image/png');
});

test('should be able to specify font options - sf mono', async () => {
  await instance
    .post('/api')
    .send({ code: 'console.log("sup world");', font: 'sf mono' })
    .expect(200)
    .expect('content-type', 'image/png');
});

test('should be able to specify font options - fira code', async () => {
  await instance
    .post('/api')
    .send({ code: 'console.log("sup world");', font: 'fira code' })
    .expect(200)
    .expect('content-type', 'image/png');
});

test.run();
