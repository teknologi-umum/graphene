import type { Middleware } from "polka";
import { generateImage } from "@/logic/generateImage";
import { logtail } from "@/utils";
import { optionSchema, OptionSchema } from "@/schema/options";
import { ValidationError } from "yup";

export const coreHandler: Middleware = async (req, res) => {
  if (req.body === "" || !Object.keys(req.body).length) {
    res
      .writeHead(400, { "Content-Type": "application/json" })
      .end(JSON.stringify({ msg: "Body can't be empty!" }));
    return;
  }

  try {
    const options = (await optionSchema.validate(req.body, {
      abortEarly: false
    })) as OptionSchema;
    const { image, format, length } = await generateImage(options);

    res
      .writeHead(200, {
        "Content-Type": `image/${format === "svg" ? "svg+xml" : format}`,
        "Content-Length": length
      })
      .end(image);
  } catch (err) {
    if (err instanceof ValidationError && err.name === "ValidationError") {
      res
        .writeHead(400, { "Content-Type": "application/json" })
        .end(JSON.stringify({ msg: err.errors }));
    }
    return;
  }

  /* c8 ignore start */
  await logtail.info("Incoming POST request", {
    body: req.body || "",
    headers: {
      accept: req.headers.accept || "",
      "content-type": req.headers["content-type"] || "",
      origin: req.headers.origin || "",
      referer: req.headers.referer || "",
      "user-agent": req.headers["user-agent"] || ""
    },
    port: req.socket.remotePort || "",
    ipv: req.socket.remoteFamily || ""
  });
  /* c8 ignore end */
};
