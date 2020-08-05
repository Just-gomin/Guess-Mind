/*
    Socket Event들의 모음
*/

const socketController = (socket) => {
  socket.on("setNickname", ({ nickname }) => {
    console.log(nickname);
    socket.nickname = nickname;
  });
};

export default socketController;
