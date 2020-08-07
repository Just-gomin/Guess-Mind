import { getSocket } from "./sockets";

// HTML Elements
const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");

const brushSizeInput = document.getElementById("jsBrushSize");
const brushSizeText = document.getElementById("jsBrushSizeText");

const modeBtn = document.getElementById("jsMode");
const initializeBtn = document.getElementById("jsInitialize");

const colors = document.getElementsByClassName("jsColor");

const INITIAL_COLOR = "black";
const CANVAS_SIZE = 550;

// Default Values
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let isPainting = false;
let isFilling = false;

// Functions
const stopPainting = () => {
  isPainting = false;
};

const startPainting = () => {
  isPainting = true;
};

const beginPath = (x, y) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
};

const strokePath = (x, y) => {
  ctx.lineTo(x, y);
  ctx.stroke();
};

const onMouseMove = (event) => {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!isPainting) {
    beginPath(x, y);
    getSocket().emit(window.events.beginPath, { x, y });
  } else {
    strokePath(x, y);
    getSocket().emit(window.events.strokePath, { x, y });
  }
};

const handleCanvasClick = () => {
  if (isFilling) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    isFilling = false;
    modeBtn.innerText = "Fill";
  }
};

const handleRightClick = (event) => {
  event.preventDefault();
};

const handleColorClick = (event) => {
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
};

const handleBrushSizeChange = (event) => {
  const brushSize = event.target.value;
  ctx.lineWidth = brushSize;
  brushSizeText.innerText = brushSize.includes(".")
    ? brushSize
    : `${brushSize}.0`;
};

const handleModeClick = () => {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "FILL";
  } else {
    isFilling = true;
    modeBtn.innerText = "Paint";
  }
};

const handleInitializeClick = () => {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// Event Listeners
if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("contextmenu", handleRightClick);
}

Array.from(colors).forEach((color) =>
  color.addEventListener("click", handleColorClick)
);

if (brushSizeInput) {
  brushSizeInput.addEventListener("input", handleBrushSizeChange);
}

if (modeBtn) {
  modeBtn.addEventListener("click", handleModeClick);
}

if (initializeBtn) {
  initializeBtn.addEventListener("click", handleInitializeClick);
}

export const handleBeganPath = ({ x, y }) => beginPath(x, y);
export const handleStrokedPath = ({ x, y }) => strokePath(x, y);
