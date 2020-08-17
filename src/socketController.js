/*
  Server Side Socket Controller.
*/

import events from "./events";
import { chooseWord } from "./words";

let sockets = [];
let inprogress = false;
let word = null;
let painter = null;

const choosePainter = () => sockets[Math.floor(Math.random() * sockets.length)];

const socketController = (socket, io) => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data); // Socket이 자기 자신을 제외한 전역에 이벤트 전달.
  const superBroadcast = (event, data) => io.emit(event, data); // server에서 연결된 socket들에게 전역으로 이벤트 전달.
  const sendPlayerUpdate = () =>
    superBroadcast(events.playerUpdate, { sockets }); // Player가 추가될 때 event 전달.
  const startGame = () => {
    if (inprogress === false) {
      inprogress = true;
      painter = choosePainter();
      word = chooseWord();
      superBroadcast(events.gameStarting);
      setTimeout(() => {
        superBroadcast(events.gameStarted);
      }, 3000);
      setTimeout(() => {
        io.to(painter.id).emit(events.painterNotif, { word });
      }, 4000);
    }
  };
  const endGame = () => {
    inprogress = false;
    superBroadcast(events.gameEnded);
  };

  const addPoints = (id) => {
    sockets = sockets.map((socket) => {
      if (socket.id === id) {
        socket.points += 10;
      }
      return socket;
    });
    sendPlayerUpdate();
    endGame();
  };

  socket.on(events.setNickname, ({ nickname }) => {
    socket.nickname = nickname;
    sockets.push({ id: socket.id, nickname: socket.nickname, points: 0 });
    broadcast(events.newUser, { nickname });
    sendPlayerUpdate();
    if (sockets.length >= 2) {
      startGame();
    }
  });

  socket.on(events.disconnect, () => {
    sockets = sockets.filter((tempSocket) => tempSocket.id !== socket.id); // 연결이 끊긴 socket의 id와 다른 것들만 반환합니다.
    if (
      sockets.length === 1 ||
      (painter !== null && socket.id === painter.id)
    ) {
      endGame();
    }
    broadcast(events.disconnected, { nickname: socket.nickname });
    sendPlayerUpdate();
  });

  socket.on(events.sendMsg, ({ message }) => {
    if (message === word) {
      superBroadcast(events.newMsg, {
        message: `"${socket.nickname}"님이 "${word}"를 맞추셨습니다.`,
        nickname: "Bot",
      });
      addPoints(socket.id);
    } else {
      broadcast(events.newMsg, { message, nickname: socket.nickname });
    }
  });

  socket.on(events.beginPath, ({ x, y }) =>
    broadcast(events.beganPath, { x, y })
  );

  socket.on(events.strokePath, ({ x, y, color, brushSize }) =>
    broadcast(events.strokedPath, { x, y, color, brushSize })
  );

  socket.on(events.fill, ({ color }) => broadcast(events.filled, { color }));

  socket.on(events.initialize, () => broadcast(events.initialized));
};

export default socketController;
