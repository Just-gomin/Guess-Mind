import {
  disableCanvas,
  hideControls,
  enableCanvas,
  showControls,
  initializeCanvas,
} from "./game";
import { disableChat, enableChat } from "./chat";

// HTML Elements
const playerTable = document.getElementById("jsPlayerTable");
const notifs = document.getElementById("jsNotifs");

// 사용자 추가 처리
const addPlayers = (players) => {
  playerTable.innerHTML = `
    <tr class="table__header">
        <th>Nickname</th>
        <th>Score</th>
    <tr>
    `;
  players.forEach((player) => {
    const playerElement = document.createElement("tr");
    playerElement.classList.add("table__user");
    playerElement.innerHTML = `
        <td>${player.nickname}</td>
        <td>${player.points}</td>
    `;

    playerTable.appendChild(playerElement);
  });
};

// Painter와 단어 알림
const setNotifs = (text) => {
  notifs.innerText = "";
  notifs.innerText = text;
};

// Socket Events 처리
// 사용자 정보 갱신 처리
export const handlePlayerUpdate = ({ sockets }) => addPlayers(sockets);

// 게임 시작 전 준비 단계 처리
export const handleGameStarting = () => setNotifs("게임이 곧 시작됩니다.");

// 게임 시작 처리
export const handleGameStarted = () => {
  setNotifs("");
  initializeCanvas();
  disableCanvas();
  hideControls();
  enableChat();
};

// Painter에게 단어 전달 처리
export const handlePainterNotif = ({ word }) => {
  enableCanvas();
  showControls();
  disableChat();
  setNotifs("");
  setNotifs(`"${word}"에 대해 그려주세요!`);
};

// 게임 종료 처리
export const handleGameEnded = () => {
  setNotifs("게임이 종료되었습니다.");
  initializeCanvas();
  disableCanvas();
  hideControls();
};
