/*
    서버 코드
*/

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import socketIO from "socket.io";
import socketController from "./socketController";
import events from "./events";

const PORT = 4000;
const app = express();

app.use(helmet());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "static")));
app.use(morgan("dev"));

// Home routes로 접속시 서버단에서 사용하는 events를 넘겨주어 클라이언트단에서도 events를 사용할 수 있게 한다.
app.get("/", (req, res) => {
  res.render("home", { events: JSON.stringify(events) });
});

const handleListening = () =>
  console.log(`✅Server Running : http://localhost:${PORT}`);

// HTTP 서버로 PORT에서 수신
const server = app.listen(PORT, handleListening);

// Socket으로 HTTP의 서버와 같은 PORT에서 수신, socket server의 변수
const io = socketIO.listen(server);

// Connection(Client가 접속한 경우) 이벤트 발생시 처리
io.on("connection", (socket) => socketController(socket, io));
