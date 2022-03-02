import { test } from "uvu";
import request from "supertest";
import server from "../src/index";

const instance = request(server.handler);

test("should generate a png image", async () => {
  await instance
    .post("/api")
    .send({
      code: 'console.log("sup world")',
      lang: "javascript"
    })
    .expect(200)
    .expect("content-type", "image/png");
});

test("should generate an upscaled jpeg image", async () => {
  await instance
    .post("/api")
    .send({
      code: 'console.log("sup world")',
      lang: "javascript",
      upscale: 1.5,
      format: "jpeg"
    })
    .expect(200)
    .expect("content-type", "image/jpeg");
});

test("should error when upscale is lower than 1", async () => {
  await instance
    .post("/api")
    .send({
      code: 'console.log("sup world")',
      lang: "javascript",
      upscale: -22,
      format: "jpeg"
    })
    .expect(400)
    .expect("content-type", "application/json")
    .expect({ msg: ["`upscale` can't be lower than 1 or higher than 5!"] });
});

test("should error when upscale is 0", async () => {
  await instance
    .post("/api")
    .send({
      code: 'console.log("sup world")',
      lang: "javascript",
      upscale: 0,
      format: "jpeg"
    })
    .expect(400)
    .expect("content-type", "application/json")
    .expect({ msg: ["`upscale` can't be lower than 1 or higher than 5!"] });
});

test("should error when upscale is not a number", async () => {
  await instance
    .post("/api")
    .send({
      code: 'console.log("sup world")',
      lang: "javascript",
      upscale: "asdf",
      format: "jpeg"
    })
    .expect(400)
    .expect("content-type", "application/json")
    .expect({ msg: ["`upscale` must be a number!"] });
});

test.run();
