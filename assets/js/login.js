/*
    Login Flow.

    Client Side의 Socket 진입점.

    1. 사용자 이름 기입
    2. Socket 연결
*/

import { initSockets } from "./sockets";

// HTML Elements
const body = document.querySelector("body");
const loginForm = document.getElementById("jsLogin");

// Constant Variables
const NICKNAME = "nickname";
const LOGGED_OUT = "loggedOut";
const LOGGED_IN = "loggedIn";

// Value in Local Storage
const nickname = localStorage.getItem(NICKNAME);

// 닉네임을 받고, Socket 연결 처리
const logIn = (nickname) => {
  // eslint-disable-next-line no-undef
  const socket = io("/"); // Socket 연결 처리 (Client)
  socket.emit(window.events.setNickname, { nickname });
  initSockets(socket);
};

// 닉네임 입력 처리 - Local Storage에 저장, Socket 연결
const handleFormSubmit = (e) => {
  e.preventDefault();
  const input = loginForm.querySelector("input");
  const { value } = input;
  localStorage.setItem(NICKNAME, value);
  input.value = "";
  body.className = LOGGED_IN;
  logIn(value);
};

// 닉네임의 존재 유무에 따라 화면 처리
if (nickname === null) {
  body.classList = LOGGED_OUT;
} else {
  body.classList = LOGGED_IN;
  logIn(nickname);
}

// loginForm 존재시 submit event 처리
if (loginForm) {
  loginForm.addEventListener("submit", handleFormSubmit);
}
