/*
  Server Side Socket Controller.
*/

import events from "./events";
import { chooseWord } from "./words";

let sockets = [];
let inprogress = false;
let word = null;
let painter = null;
let timeout = null;

// 임의로 painter 선정
const choosePainter = () => sockets[Math.floor(Math.random() * sockets.length)];

const socketController = (socket, io) => {
  // Socket이 자기 자신을 제외한 전역에 이벤트 전달.
  const broadcast = (event, data) => socket.broadcast.emit(event, data);

  // server에서 연결된 socket들에게 전역으로 이벤트 전달.
  const superBroadcast = (event, data) => io.emit(event, data);

  // Player 정보 변경시 전역으로 전달.
  const sendPlayerUpdate = () =>
    superBroadcast(events.playerUpdate, { sockets });

  // 게임 시작 function - pinter결정, 단어 선택, 게임 준비와 진행 및 종료(정상 종료, 시간 초과 종료)
  const startGame = () => {
    if (sockets.length > 1) {
      if (inprogress === false) {
        inprogress = true;
        painter = choosePainter();
        word = chooseWord();
        superBroadcast(events.gameStarting);
        setTimeout(() => {
          superBroadcast(events.gameStarted, { painter });
        }, 3000);
        setTimeout(() => {
          io.to(painter.id).emit(events.painterNotif, { word });
          timeout = setTimeout(() => endGame(), 60000);
        }, 4000);
      }
    }
  };
  // 게임 종료 - timeout이 존재하면 timeout 제거, 새로운 게임 진행
  const endGame = () => {
    inprogress = false;
    superBroadcast(events.gameEnded);
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    setTimeout(() => startGame(), 2000);
  };

  // 점수 부여
  const addPoints = (id) => {
    sockets = sockets.map((socket) => {
      if (socket.id === id) {
        socket.points += 10;
      }
      return socket;
    });
    sendPlayerUpdate();
    endGame();
    clearTimeout(timeout);
  };

  // 게임에 참여하기 위한 NickName 설정 Event
  socket.on(events.setNickname, ({ nickname }) => {
    socket.nickname = nickname;
    sockets.push({ id: socket.id, nickname: socket.nickname, points: 0 });
    broadcast(events.newUser, { nickname });
    sendPlayerUpdate();
    startGame();
  });

  // 접속 종료 Event
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

  // 채팅 Event - 보낸 단어가 정답 단어일 경우 봇메세지 및 점수 증가, 아닌 경우 참가자들에게 메세지 전송
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

  // Painter가 그림을 그리기 시작한경우의 Path 생성 Event
  socket.on(events.beginPath, ({ x, y }) =>
    broadcast(events.beganPath, { x, y })
  );

  // 생성된 Path에 붓 크기와 색상으로 색칠하는 Event
  socket.on(events.strokePath, ({ x, y, color, brushSize }) =>
    broadcast(events.strokedPath, { x, y, color, brushSize })
  );

  // Canvas를 특정 색으로 채우는 Event
  socket.on(events.fill, ({ color }) => broadcast(events.filled, { color }));

  // Canvas를 초기화하는 Event
  socket.on(events.initialize, () => broadcast(events.initialized));
};

export default socketController;
