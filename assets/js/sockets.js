/*
    Client Side Socket Controller.

    1. 알림동작 (notifications.js)
*/

import { handleNewUser, handleDisconnected } from "./notifications";
import { handleNewMsg } from "./chat";
import { handleBeganPath, handleStrokedPath, handleFilled } from "./game";

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
};
