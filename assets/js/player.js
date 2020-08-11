const playerTable = document.getElementById("jsPlayerTable");

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
export const handlePlayerUpdate = ({ sockets }) => addPlayers(sockets);
