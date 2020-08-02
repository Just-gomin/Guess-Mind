// eslint-disable-next-line no-undef
const socket = io("/");

// eslint-disable-next-line no-unused-vars
function sendMessage(message) {
  socket.emit("newMessage", { message });
  console.log(`You: ${message}`);
}

// eslint-disable-next-line no-unused-vars
function setNickname(nickname) {
  socket.emit("setNickname", { nickname });
}

function handleMessageNotif(data) {
  const { message, nickname } = data;
  console.log(`${nickname} : ${message}`);
}

socket.on("messageNotif", handleMessageNotif);
