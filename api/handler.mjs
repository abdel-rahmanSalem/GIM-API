import { createServer } from "http";
import app from "../src/index.mjs";

export default function handler(req, res) {
  const server = createServer(app);
  server.emit("request", req, res);
}
