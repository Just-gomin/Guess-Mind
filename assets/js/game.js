import { getSocket } from "./sockets";

// HTML Elements
const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");

const controls = document.getElementById("jsControls");

const brushSizeInput = document.getElementById("jsBrushSize");
const brushSizeText = document.getElementById("jsBrushSizeText");

const modeBtn = document.getElementById("jsMode");
const initializeBtn = document.getElementById("jsInitialize");

const colors = document.getElementsByClassName("jsColor");

const INITIAL_COLOR = "black";
const INITIAL_BRUSH_SIZE = 2.5;
const CANVAS_SIZE = 600;

// Default Values
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = INITIAL_BRUSH_SIZE;

let isPainting = false;
let isFilling = false;

// Functions

// 마우스가 눌려지지 않은 채 Canvas위를 배회하는 경우 처리
const stopPainting = () => {
  isPainting = false;
};

// 마우스가 눌려진 채 Canvas위를 배회하는 경우 처리
const startPainting = () => {
  isPainting = true;
};

// Canvas위의 Path 시작 처리
const beginPath = (x, y) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
};

// Path 색칠 처리
const strokePath = (x, y, color = null, brushSize = null) => {
  let currentColor = ctx.strokeStyle;
  let currentBrushSize = ctx.lineWidth;
  if (color !== null) {
    ctx.strokeStyle = color;
  }
  if (brushSize !== null) {
    ctx.lineWidth = brushSize;
  }
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = currentBrushSize;
};

// Canvas 위의 마우스 움직임 처리
const onMouseMove = (event) => {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!isPainting) {
    beginPath(x, y);
    getSocket().emit(window.events.beginPath, { x, y });
  } else {
    strokePath(x, y);
    getSocket().emit(window.events.strokePath, {
      x,
      y,
      color: ctx.strokeStyle,
      brushSize: ctx.lineWidth,
    });
  }
};

// Canvas 우클릭 금지 처리
const handleRightClick = (event) => {
  event.preventDefault();
};

// Canvas 색상 채우기
const fillCanvas = (color = null) => {
  let currentColor = ctx.fillStyle;
  if (color !== null) {
    ctx.fillStyle = color;
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = currentColor;
};

// Canvas를 클릭했을 때 색채우기 처리
const handleCanvasClick = () => {
  if (isFilling) {
    fillCanvas();
    isFilling = false;
    modeBtn.innerText = "Fill";
    getSocket().emit(window.events.fill, { color: ctx.fillStyle });
  }
};

// 붓 크기 처리
const handleBrushSizeChange = (event) => {
  const brushSize = event.target.value;
  ctx.lineWidth = brushSize;
  brushSizeText.innerText = brushSize.includes(".")
    ? brushSize
    : `${brushSize}.0`;
};

// Canvas 클릭시 (Fill / Paint) 구분 처리
const handleModeClick = () => {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "FILL";
  } else {
    isFilling = true;
    modeBtn.innerText = "Paint";
  }
};

// Canvas 초기화 처리
export const initializeCanvas = () => {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// Initialize 버튼 클릭 처리
const handleInitializeClick = () => {
  initializeCanvas();
  getSocket().emit(window.events.initialize);
};

// 색상 선택 처리
const handleColorClick = (event) => {
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
};

// Socket Event 처리
// Painter가 Path를 생성하기 시작하면 다른 참여자들의 Canvas도 Path 생성
export const handleBeganPath = ({ x, y }) => beginPath(x, y);

// 생성된 Path에 색과 붓 크기에 맞게 그리기
export const handleStrokedPath = ({ x, y, color, brushSize }) =>
  strokePath(x, y, color, brushSize);

// 색 채우기 처리
export const handleFilled = ({ color }) => fillCanvas(color);

// 초기화 처리
export const handleInitialized = () => initializeCanvas();

// Painter 외의 게임 참여자들은 Canvas 조작이 불가하도록 처리
export const disableCanvas = () => {
  canvas.removeEventListener("mousemove", onMouseMove);
  canvas.removeEventListener("mousedown", startPainting);
  canvas.removeEventListener("mouseup", stopPainting);
  canvas.removeEventListener("mouseleave", stopPainting);
  canvas.removeEventListener("click", handleCanvasClick);
};

// Painter의 Canvas 조작이 가능하도록 처리
export const enableCanvas = () => {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
};

// Painter외의 게임 참여자들이 Controller를 조작 못하도록 처리
export const hideControls = () => {
  controls.style.display = "none";
};

// Painter는 Controller를 조작할 수 있도록 처리
export const showControls = () => {
  controls.style.display = "flex";
};

// Event Listeners
// Canvas 존재시 우클릭 처리 Event 달기
if (canvas) {
  enableCanvas();
  canvas.addEventListener("contextmenu", handleRightClick);
}

// Brush Size Input 존재시  Input Event 처리
if (brushSizeInput) {
  brushSizeInput.addEventListener("input", handleBrushSizeChange);
}

// Mode Button 존재시 Click Event 처리
if (modeBtn) {
  modeBtn.addEventListener("click", handleModeClick);
}

// Initialize Button 존재시 Click Event 처리
if (initializeBtn) {
  initializeBtn.addEventListener("click", handleInitializeClick);
}

// 각 색상마다 Click Event 달아주기
Array.from(colors).forEach((color) =>
  color.addEventListener("click", handleColorClick)
);
