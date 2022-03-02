import { test } from "uvu";
import request from "supertest";
import polka from "polka";
import { parser } from "../src/middleware/parser";

const server = polka().post("/", parser, (req, res) =>
  res
    .writeHead(200, { "Content-Type": "application/json" })
    .end(JSON.stringify(req.body))
);

const instance = request(server.handler);

test("should be able to parse urlencoded", async () => {
  await instance
    .post("/")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .send("hello=world&list=1&list=2&list=3&failed=false")
    .expect(200)
    .expect('{"hello":"world","list":["1","2","3"],"failed":"false"}');
});

test("should be able to parse toml", async () => {
  await instance
    .post("/")
    .set("Content-Type", "application/toml")
    .send('hello = "world"\nlist = [ 1, 2, 3 ]\nfailed = false')
    .expect(200)
    .expect('{"hello":"world","list":[1,2,3],"failed":false}');

  await instance
    .post("/")
    .set("Content-Type", "text/x-toml")
    .send('hello = "world"\nlist = [ 1, 2, 3 ]\nfailed = false')
    .expect(200)
    .expect('{"hello":"world","list":[1,2,3],"failed":false}');
});

test("should be able to parse yaml", async () => {
  await instance
    .post("/")
    .set("Content-Type", "application/x-yaml")
    .send("hello: world\nlist:\n  - 1\n  - 2\n  - 3\nfailed: false")
    .expect(200)
    .expect('{"hello":"world","list":[1,2,3],"failed":false}');

  await instance
    .post("/")
    .set("Content-Type", "text/yaml")
    .send("hello: world\nlist:\n  - 1\n  - 2\n  - 3\nfailed: false")
    .expect(200)
    .expect('{"hello":"world","list":[1,2,3],"failed":false}');
});

test("should be able to parse gura", async () => {
  await instance
    .post("/")
    .set("Content-Type", "application/gura")
    .send('hello: "world"\nlist: [1, 2, 3]\nfailed: false')
    .expect(200)
    .expect('{"hello":"world","list":[1,2,3],"failed":false}');

  await instance
    .post("/")
    .set("Content-Type", "text/gura")
    .send('hello: "world"\nlist: [1, 2, 3]\nfailed: false')
    .expect(200)
    .expect('{"hello":"world","list":[1,2,3],"failed":false}');
});

test("should be able to parse json", async () => {
  await instance
    .post("/")
    .set("Content-Type", "application/json")
    .send('{"hello":"world","list":[1,2,3],"failed":false}')
    .expect(200)
    .expect('{"hello":"world","list":[1,2,3],"failed":false}');
});

test("invalid content type headers should fall back to json", async () => {
  await instance
    .post("/")
    .set("Content-Type", "brave")
    .send('{"hello":"world","list":[1,2,3],"failed":false}')
    .expect(200)
    .expect('{"hello":"world","list":[1,2,3],"failed":false}');
});

test.run();
