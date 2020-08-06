/*
  알람 동작에 대한 파일입니다.
*/
const notifications = document.getElementById("jsNotifications");

const STATUS_GOOD = "good";
const STATUS_BAD = "bad";
const COLOR_GOOD = "#396ec4";
const COLOR_BAD = "#c43957";

const fireNotification = (text, status) => {
  const notification = document.createElement("div");

  notification.innerText = text;

  if (status === STATUS_GOOD) {
    notification.style.backgroundColor = COLOR_GOOD;
  } else if (status === STATUS_BAD) {
    notification.style.backgroundColor = COLOR_BAD;
  }

  notifications.appendChild(notification);
};

export const handleNewUser = ({ nickname }) => {
  console.log(nickname);
  fireNotification(`"${nickname}" just joined!`, STATUS_GOOD);
};

export const handleDisconnected = ({ nickname }) => {
  fireNotification(`"${nickname}" just left!`, STATUS_BAD);
};
