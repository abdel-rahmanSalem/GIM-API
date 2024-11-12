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

app.use("/gim/v1/register", registerRouter);
app.use("/gim/v1/login", loginRouter);
app.use("/gim/v1/token", tokenRouter);
app.use("/gim/v1/logout", logoutRouter);
app.use("/gim/v1/owners", ownersRouter);
app.use("/gim/v1/gyms", gymsRouter);

app.all("*", (req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

export default (req, res) => {
  app(req, res);
};
