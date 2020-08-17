/*
  알람 동작에 대한 파일입니다.
*/

// HTML Element
const body = document.querySelector("body");

// constant variables
const STATUS_GOOD = "good";
const STATUS_BAD = "bad";
const COLOR_GOOD = "#396ec4";
const COLOR_BAD = "#f39c12";

// 화면에 알림을 띄우는 함수입니다.
const fireNotification = (text, status) => {
  const notification = document.createElement("div");

  notification.classList.add("notification");
  notification.innerText = text;

  if (status === STATUS_GOOD) {
    notification.style.backgroundColor = COLOR_GOOD;
  } else if (status === STATUS_BAD) {
    notification.style.backgroundColor = COLOR_BAD;
  }

  body.appendChild(notification);
};

// 게임 참가자 발생시 처리 함수
export const handleNewUser = ({ nickname }) => {
  fireNotification(`"${nickname}" 님이\n참가하셨습니다!`, STATUS_GOOD);
};

// 게임 참가자가 나갔을 경우 처리 함수
export const handleDisconnected = ({ nickname }) => {
  fireNotification(`"${nickname}" 님이\n나가셨습니다!`, STATUS_BAD);
};
