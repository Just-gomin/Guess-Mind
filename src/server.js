/*
    서버 코드
*/

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import socketIO from "socket.io";

const PORT = 4000;
const app = express();

app.use(helmet());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "static")));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.render("home");
});

const handleListening = () =>
  console.log(`✅Server Running : http://localhost:${PORT}`);

const server = app.listen(PORT, handleListening);

const io = socketIO(server);
