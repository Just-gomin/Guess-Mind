import { handleNewUser } from "./notifications";

let socket = null;

export const getSocket = () => socket;

export const updateSocket = (newSocket) => {
  socket = newSocket;
};

export const initSockets = (newSocket) => {
  const { events } = window;
  updateSocket(newSocket);
  socket.on(events.newUser, handleNewUser);
};
