import { it } from "vitest";
import request from "supertest";
import server from "../src/index";

const instance = request(server.handler);

it("should output png", async () => {
  await instance
    .post("/api")
    .send({ code: "console.log('foo');", imageFormat: "png" })
    .expect(200)
    .expect("content-type", "image/png");
});

it("should output jpeg", async () => {
  await instance
    .post("/api")
    .send({ code: "console.log('foo');", imageFormat: "jpeg" })
    .expect(200)
    .expect("content-type", "image/jpeg");
});

it("should output webp", async () => {
  await instance
    .post("/api")
    .send({ code: "console.log('foo');", imageFormat: "webp" })
    .expect(200)
    .expect("content-type", "image/webp");
});

it("should output svg", async () => {
  await instance
    .post("/api")
    .send({ code: "console.log('foo');", imageFormat: "svg" })
    .expect(200)
    .expect("content-type", "image/svg+xml");
});
