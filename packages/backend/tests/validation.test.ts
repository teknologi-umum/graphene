import { it } from "vitest";
import request from "supertest";
import server from "../src/index";

const instance = request(server.handler);

it("should error when body is empty", async () => {
  await instance.post("/api").send({}).expect(400).expect("content-type", "application/json");
});

it("should error without a code", async () => {
  await instance.post("/api").send({ language: "javascript" }).expect(400).expect("content-type", "application/json");
});

it("should error when lineNumber is not a boolean", async () => {
  await instance
    .post("/api")
    .send({ code: 'console.log("foo");', showLineNumber: "asd" })
    .expect(400)
    .expect("content-type", "application/json");
});

it("should work when lineNumber is a boolean", async () => {
  await instance
    .post("/api")
    .send({ code: 'console.log("foo");', showLineNumber: false })
    .expect(200)
    .expect("content-type", "image/png");
});

it("should work when language is auto-detect", async () => {
  await instance
    .post("/api")
    .send({ code: 'console.log("foo");', language: 'auto-detect' })
    .expect(200)
    .expect("content-type", "image/png");
});

it("should error with bad format", async () => {
  await instance
    .post("/api")
    .send({
      language: "javascript",
      code: "console.log('foo')",
      imageFormat: "asdf"
    })
    .expect(400)
    .expect("content-type", "application/json");
});

it("should error when theme does not exists", async () => {
  await instance
    .post("/api")
    .send({
      code: 'console.log("sup world")',
      language: "javascript",
      imageFormat: "jpeg",
      theme: "foobar"
    })
    .expect(400)
    .expect("content-type", "application/json");
});

it("should error when invalid font was given", async () => {
  await instance
    .post("/api")
    .send({
      font: "asd",
      code: "console.log('foo')"
    })
    .expect(400)
    .expect("content-type", "application/json");
});

it("what if we had multiple errors?", async () => {
  await instance
    .post("/api")
    .send({
      font: "asd",
      imageFormat: "qwe",
      theme: "something else",
      upscale: -5,
      code: ""
    })
    .expect(400)
    .expect("content-type", "application/json");
});
