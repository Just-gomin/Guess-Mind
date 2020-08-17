import {
  disableCanvas,
  hideControls,
  enableCanvas,
  showControls,
  initializeCanvas,
} from "./game";
import { disableChat, enableChat } from "./chat";

const playerTable = document.getElementById("jsPlayerTable");
const notifs = document.getElementById("jsNotifs");

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

const setNotifs = (text) => {
  notifs.innerText = "";
  notifs.innerText = text;
};

export const handlePlayerUpdate = ({ sockets }) => addPlayers(sockets);
export const handleGameStarted = () => {
  setNotifs("");
  initializeCanvas();
  disableCanvas();
  hideControls();
  enableChat();
};
export const handlePainterNotif = ({ word }) => {
  enableCanvas();
  showControls();
  disableChat();
  setNotifs("");
  setNotifs(`"${word}"에 대해 그려주세요!`);
};
export const handleGameEnded = () => {
  setNotifs("게임이 종료되었습니다.");
  initializeCanvas();
  disableCanvas();
  hideControls();
};

export const handleGameStarting = () => setNotifs("게임이 곧 시작됩니다.");
