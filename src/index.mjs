import express from "express";
import cors from "cors";
import ownersRouter from "../routes/owners.mjs";
import gymsRouter from "../routes/gyms.mjs";
import registerRouter from "../routes/register.mjs";
import loginRouter from "../routes/login.mjs";
import tokenRouter from "../routes/token.mjs";
import logoutRouter from "../routes/logout.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use("/", (req, res) => {
  res.send("hi");
});

app.use(registerRouter);
app.use(loginRouter);
app.use(tokenRouter);
app.use(logoutRouter);
app.use(ownersRouter);
app.use(gymsRouter);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.listen(PORT, () => {
  console.log(`RUNNING ON PORT: ${PORT}`);
});
