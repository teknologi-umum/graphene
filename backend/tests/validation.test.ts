import { test } from "uvu";
import request from "supertest";
import server from "../src/index";

const instance = request(server.handler);

test("should error when body is empty", async () => {
  await instance.post("/api").send({}).expect(400).expect("content-type", "application/json");
});

test("should error without a code", async () => {
  await instance.post("/api").send({ lang: "javascript" }).expect(400).expect("content-type", "application/json");
});

test("should error when lineNumber is not a boolean", async () => {
  await instance
    .post("/api")
    .send({ code: 'console.log("foo");', lineNumber: "asd" })
    .expect(400)
    .expect("content-type", "application/json");
});

test("should work when lineNumber is a boolean", async () => {
  await instance
    .post("/api")
    .send({ code: 'console.log("foo");', lineNumber: false })
    .expect(200)
    .expect("content-type", "image/png");
});

test("should work when lang is null which means auto-detect", async () => {
  await instance
    .post("/api")
    .send({ code: 'console.log("foo");', lang: null })
    .expect(200)
    .expect("content-type", "image/png");
});

test("should error with bad format", async () => {
  await instance
    .post("/api")
    .send({
      lang: "javascript",
      code: "console.log('foo')",
      format: "asdf"
    })
    .expect(400)
    .expect("content-type", "application/json");
});

test("should error when theme does not exists", async () => {
  await instance
    .post("/api")
    .send({
      code: 'console.log("sup world")',
      lang: "javascript",
      format: "jpeg",
      theme: "foobar"
    })
    .expect(400)
    .expect("content-type", "application/json");
});

test("should error when invalid font was given", async () => {
  await instance
    .post("/api")
    .send({
      font: "asd",
      code: "console.log('foo')"
    })
    .expect(400)
    .expect("content-type", "application/json");
});

test("what if we had multiple errors?", async () => {
  await instance
    .post("/api")
    .send({
      font: "asd",
      format: "qwe",
      theme: "something else",
      upscale: -5,
      code: ""
    })
    .expect(400)
    .expect("content-type", "application/json");
});

test.run();
