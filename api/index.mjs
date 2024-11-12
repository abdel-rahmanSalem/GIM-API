import express from "express";
import cors from "cors";
import registerRouter from "../routes/register.mjs";
import loginRouter from "../routes/login.mjs";
import tokenRouter from "../routes/token.mjs";
import logoutRouter from "../routes/logout.mjs";
import ownersRouter from "../routes/owners.mjs";
import gymsRouter from "../routes/gyms.mjs";

const app = express();

app.use(cors());
app.use(express.json());

app.use(registerRouter);
app.use(loginRouter);
app.use(tokenRouter);
app.use(logoutRouter);
app.use(ownersRouter);
app.use(gymsRouter);

app.all("*", (req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

export default (req, res) => {
  app(req, res);
};
