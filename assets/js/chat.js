/*
    client들이 socket을 통해 채팅을 가능하게 하는 파일입니다.
*/
const messages = document.getElementById("jsMessages"); // messages container
const sendMsg = document.getElementById("jsSendMessage");

const appendMsg = (text, nickname) => {
  const li = document.createElement("li");
  li.innerHTML = `<span class="author ${nickname ? "others" : "self"}">${
    nickname ? nickname : "You"
  }: </span>${text}`;
  messages.appendChild(li);
};

const handleSendMsg = (event) => {
  event.preventDefault();
  const input = sendMsg.querySelector("input");
  const { value } = input;
  input.value = "";
  appendMsg(value);
};

if (sendMsg) {
  sendMsg.addEventListener("submit", handleSendMsg);
}
