import { it } from "vitest";
import request from "supertest";
import server from "../src/index";

const instance = request(server.handler);

it("should generate a png image", async () => {
  await instance
    .post("/api")
    .send({
      code: 'console.log("sup world")',
      language: "javascript"
    })
    .expect(200)
    .expect("content-type", "image/png");
});

it("should generate an upscaled jpeg image", async () => {
  await instance
    .post("/api")
    .send({
      code: 'console.log("sup world")',
      language: "javascript",
      upscale: 1.5,
      imageFormat: "jpeg"
    })
    .expect(200)
    .expect("content-type", "image/jpeg");
});

it("should error when upscale is lower than 1", async () => {
  await instance
    .post("/api")
    .send({
      code: 'console.log("sup world")',
      language: "javascript",
      upscale: -22,
      imageFormat: "jpeg"
    })
    .expect(400)
    .expect("content-type", "application/json");
});

it("should error when upscale is 0", async () => {
  await instance
    .post("/api")
    .send({
      code: 'console.log("sup world")',
      language: "javascript",
      upscale: 0,
      imageFormat: "jpeg"
    })
    .expect(400)
    .expect("content-type", "application/json");
});

it("should error when upscale is not a number", async () => {
  await instance
    .post("/api")
    .send({
      code: 'console.log("sup world")',
      language: "javascript",
      upscale: "asdf",
      imageFormat: "jpeg"
    })
    .expect(400)
    .expect("content-type", "application/json");
});
