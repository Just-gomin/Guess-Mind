/*
  알람 동작에 대한 파일입니다.
*/
const body = document.querySelector("body");

const STATUS_GOOD = "good";
const STATUS_BAD = "bad";
const COLOR_GOOD = "#396ec4";
const COLOR_BAD = "#f39c12";

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

export const handleNewUser = ({ nickname }) => {
  console.log(nickname);
  fireNotification(`"${nickname}" 님이\n참가하셨습니다!`, STATUS_GOOD);
};

export const handleDisconnected = ({ nickname }) => {
  fireNotification(`"${nickname}" 님이\n나가셨습니다!`, STATUS_BAD);
};
