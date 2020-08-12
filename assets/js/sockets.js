/*
    Client Side Socket Controller.

    1. 알림동작 (notifications.js)
    2. 채팅 동작 (chat.js)
    3. 실시간 그림그리기 및 캔버스 채우기 (game.js)
    4. 게임 참여자 정보 갱신 (player.js)
*/

import { handleNewUser, handleDisconnected } from "./notifications";
import { handleNewMsg } from "./chat";
import {
  handleBeganPath,
  handleStrokedPath,
  handleFilled,
  handleInitialized,
} from "./game";
import {
  handlePlayerUpdate,
  handleGameStarted,
  handlePainterNotif,
  handleGameEnded,
} from "./player";

let socket = null;

export const getSocket = () => socket;

export const initSockets = (newSocket) => {
  const { events } = window;
  socket = newSocket;
  socket.on(events.newUser, handleNewUser);
  socket.on(events.disconnected, handleDisconnected);
  socket.on(events.newMsg, handleNewMsg);
  socket.on(events.beganPath, handleBeganPath);
  socket.on(events.strokedPath, handleStrokedPath);
  socket.on(events.filled, handleFilled);
  socket.on(events.initialized, handleInitialized);
  socket.on(events.playerUpdate, handlePlayerUpdate);
  socket.on(events.gameStarted, handleGameStarted);
  socket.on(events.painterNotif, handlePainterNotif);
  socket.on(events.gameEnded, handleGameEnded);
};
