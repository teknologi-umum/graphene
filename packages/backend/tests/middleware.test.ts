import { it } from "vitest";
import request from "supertest";
import app from "../src/index";

const instance = request(app.handler);

it("should pass cors options", async () => {
  await instance.options("/api").expect(204);
});

it("should error when json is invalid", async () => {
  await instance
    .post("/api")
    .send(`{"code": "some random text, "format": "jpeg"}`)
    .expect(400)
    .expect("content-type", "application/json");
});

it("should return not found", async () => {
  await instance.get("/foobar").expect(404).expect("content-type", "application/json");
});
