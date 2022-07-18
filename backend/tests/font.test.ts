import { test } from "uvu";
import * as assert from "uvu/assert";
import request from "supertest";
import { FONT_MAPPING } from "../src/constants";
import server from "../src/index";

const instance = request(server.handler);

test("return font setup for jetbrains mono", () => {
  const output = FONT_MAPPING["jetbrains mono"];
  assert.equal(output, {
    fontFamily: "JetBrainsMonoNL Nerd Font Mono",
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 8.4
  });
});

test("return font setup for sf mono", () => {
  const output = FONT_MAPPING["sf mono"];
  assert.equal(output, {
    fontFamily: "SFMono Nerd Font",
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 8.65
  });
});

test("return font setup for fira code", () => {
  const output = FONT_MAPPING["fira mono"];
  assert.equal(output, {
    fontFamily: "FiraCode Nerd Font Mono",
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 8.65
  });
});

test("return font setup for hack", () => {
  const output = FONT_MAPPING["hack"];
  assert.equal(output, {
    fontFamily: "Hack Nerd Font Mono",
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 8.35
  });
});

test("return font setup for iosevka", () => {
  const output = FONT_MAPPING["iosevka"];
  assert.equal(output, {
    fontFamily: "Iosevka Nerd Font Mono",
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 7
  });
});

test("return font setup for cascadia code", () => {
  const output = FONT_MAPPING["cascadia code"];
  assert.equal(output, {
    fontFamily: "CaskaydiaCove Nerd Font Mono",
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 8.15
  });
});

test("should be able to specify font options - jetbrains mono", async () => {
  await instance
    .post("/api")
    .send({ code: 'console.log("sup world");', font: "jetbrains mono" })
    .expect(200)
    .expect("content-type", "image/png");
});

test("should be able to specify font options - sf mono", async () => {
  await instance
    .post("/api")
    .send({ code: 'console.log("sup world");', font: "sf mono" })
    .expect(200)
    .expect("content-type", "image/png");
});

test("should be able to specify font options - fira code", async () => {
  await instance
    .post("/api")
    .send({ code: 'console.log("sup world");', font: "fira code" })
    .expect(200)
    .expect("content-type", "image/png");
});

test("should be able to specify font options - hack", async () => {
  await instance
    .post("/api")
    .send({ code: 'console.log("sup world");', font: "hack" })
    .expect(200)
    .expect("content-type", "image/png");
});

test("should be able to specify font options - iosevka", async () => {
  await instance
    .post("/api")
    .send({ code: 'console.log("sup world");', font: "iosevka" })
    .expect(200)
    .expect("content-type", "image/png");
});

test("should be able to specify font options - cascadia code", async () => {
  await instance
    .post("/api")
    .send({ code: 'console.log("sup world");', font: "cascadia code" })
    .expect(200)
    .expect("content-type", "image/png");
});


test("should throw when the font doesn't exist - cascadia code", async () => {
  await instance
    .post("/api")
    .send({ code: 'console.log("sup world");', font: "cascadia code" })
    .expect(200)
    .expect("content-type", "image/png");
});

test.run();
