/*
    Login Flow.

    1. 사용자 이름 기입
    2. Socket 연결

*/

import { initSockets } from "./sockets";

const body = document.querySelector("body");
const loginForm = document.getElementById("jsLogin");

const NICKNAME = "nickname";
const LOGGED_OUT = "loggedOut";
const LOGGED_IN = "loggedIn";

const nickname = localStorage.getItem(NICKNAME);

const logIn = (nickname) => {
  // eslint-disable-next-line no-undef
  const socket = io("/"); // Socket 연결 처리 (Client)
  socket.emit(window.events.setNickname, { nickname });
  initSockets(socket);
};

if (nickname === null) {
  body.classList = LOGGED_OUT;
} else {
  body.classList = LOGGED_IN;
  logIn(nickname);
}

const handleFormSubmit = (e) => {
  e.preventDefault();
  const input = loginForm.querySelector("input");
  const { value } = input;
  localStorage.setItem(NICKNAME, value);
  input.value = "";
  body.className = LOGGED_IN;
  logIn(value);
};

if (loginForm) {
  loginForm.addEventListener("submit", handleFormSubmit);
}
