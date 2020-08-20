/*
    Client Side Socket Controller.
*/

import { handleNewUser, handleDisconnected } from "./notifications";
import { handleNewMsg } from "./chat";
import {
  handleBeganPath,
  handleStrokedPath,
  handleCanvasFilled,
  handleCanvasInitialized,
  handleGameStarted,
  handlePainterNotif,
  handleGameEnded,
  handleGameStarting,
} from "./game";
import { handlePlayerUpdate } from "./player";

// 접속한 socket 객체를 담을 변수
let socket = null;

// 외부 파일에서 socket 객체를 사용할 수 있도록 하는 함수.
export const getSocket = () => socket;

// Socket의 Event 수신 처리
export const initSockets = (newSocket) => {
  const { events } = window;
  socket = newSocket;
  socket.on(events.newUser, handleNewUser); // 새로운 게임 참여자 등장 알림
  socket.on(events.disconnected, handleDisconnected); // 게임 참여자 퇴장 알림
  socket.on(events.newMsg, handleNewMsg); // Painter를 제외한 유저들의 채팅
  socket.on(events.beganPath, handleBeganPath); // Painter가 Canvas에 Path 생성
  socket.on(events.strokedPath, handleStrokedPath); // 생성된 Path에 Painter가 정한 색상과 붓 크기로 그림
  socket.on(events.filled, handleCanvasFilled); // Canvas를 특정 색으로 채움
  socket.on(events.initialized, handleCanvasInitialized); // Canvas를 초기화
  socket.on(events.playerUpdate, handlePlayerUpdate); // 게임 참여자 정보 갱신
  socket.on(events.gameStarting, handleGameStarting); // 게임 시작 준비
  socket.on(events.gameStarted, handleGameStarted); // 게임 시작
  socket.on(events.painterNotif, handlePainterNotif); // Painter로 지정된 사용자에게 단어 전달 및 Paint 기능 활성화
  socket.on(events.gameEnded, handleGameEnded); // 게임 종료
};
