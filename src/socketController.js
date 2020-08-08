/*
  Server Side Socket Controller.
*/

import events from "./events";

let sockets = [];

const socketController = (socket, io) => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data); // Socket이 자기 자신을 제외한 전역에 이벤트 전달.
  const superBroadcast = (event, data) => io.emit(event, data); // server에서 연결된 socket들에게 전역으로 이벤트 전달.
  const sendPlayerUpdate = () =>
    superBroadcast(events.playerUpdate, { sockets });

  socket.on(events.setNickname, ({ nickname }) => {
    socket.nickname = nickname;
    sockets.push({ id: socket.id, nickname: socket.nickname, points: 0 });
    broadcast(events.newUser, { nickname });
    sendPlayerUpdate();
  });

  socket.on(events.disconnect, () => {
    sockets = sockets.filter((tempSocket) => tempSocket.id !== socket.id); // 연결이 끊긴 socket의 id와 다른 것들만 반환합니다.
    broadcast(events.disconnected, { nickname: socket.nickname });
    sendPlayerUpdate();
  });

  socket.on(events.sendMsg, ({ message }) =>
    broadcast(events.newMsg, { message, nickname: socket.nickname })
  );

  socket.on(events.beginPath, ({ x, y }) =>
    broadcast(events.beganPath, { x, y })
  );

  socket.on(events.strokePath, ({ x, y, color }) =>
    broadcast(events.strokedPath, { x, y, color })
  );

  socket.on(events.fill, ({ color }) => broadcast(events.filled, { color }));
};

export default socketController;
