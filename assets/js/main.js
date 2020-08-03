import { handleMessageNotif } from "./chat";

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

socket.on("messageNotif", handleMessageNotif);
