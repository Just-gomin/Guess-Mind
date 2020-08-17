/*
    client들이 socket을 통해 채팅을 가능하게 하는 파일입니다.
*/
import { getSocket } from "./sockets";

const messages = document.getElementById("jsMessages"); // Messages Container
const sendMsg = document.getElementById("jsSendMessage"); // Message Input

// 채팅 창에 메세지 확장
const appendMsg = (text, nickname) => {
  const li = document.createElement("li");
  li.innerHTML = `<span class="author ${nickname ? "others" : "self"}">${
    nickname ? nickname : "You"
  }: </span>${text}`;
  messages.appendChild(li);
};

// 채팅 입력 처리
const handleSendMsg = (event) => {
  event.preventDefault();
  const input = sendMsg.querySelector("input");
  const { value } = input;
  getSocket().emit(window.events.sendMsg, { message: value });
  input.value = "";
  appendMsg(value);
};

if (sendMsg) {
  sendMsg.addEventListener("submit", handleSendMsg);
}

// 다른 게임 참여자로 부터 메세지가 왔을 때 처리
export const handleNewMsg = ({ message, nickname }) =>
  appendMsg(message, nickname);

// Painter가 되면 채팅을 할 수 없도록 처리
export const disableChat = () => (sendMsg.style.display = "none");

// Painter가 아닌 참여자들은 채팅이 가능하도록 처리
export const enableChat = () => (sendMsg.style.display = "flex");
