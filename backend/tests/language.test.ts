import { it } from "vitest";
import request from "supertest";
import server from "../src/index";

const instance = request(server.handler);

it("should guess the language", async () => {
  await instance
    .post("/api")
    .send({
      code: 'console.log("sup world")'
    })
    .expect(200)
    .expect("content-type", "image/png");
});

it("should use the fallback language the language", async () => {
  await instance
    .post("/api")
    .send({
      code: "something something"
    })
    .expect(200)
    .expect("content-type", "image/png");
});
