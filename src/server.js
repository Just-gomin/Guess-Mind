/*
    서버 코드
*/

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import socketIO from "socket.io";
import socketController from "./socketController";

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

// HTTP 서버로 PORT에서 수신
const server = app.listen(PORT, handleListening);

// We Socket으로 HTTP의 서버와 같은 PORT에서 수신, soxket server의 변수
const io = socketIO.listen(server);

io.on("connection", (socket) => socketController(socket)); // Connection(Client가 접속한 경우) 이벤트 발생시 처리
