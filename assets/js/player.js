// HTML Elements
const playerTable = document.getElementById("jsPlayerTable");

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

// Socket Events 처리
// 사용자 정보 갱신 처리
export const handlePlayerUpdate = ({ sockets }) => addPlayers(sockets);
