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

const fillCanvas = (color = null) => {
  let currentColor = ctx.fillStyle;
  if (color !== null) {
    ctx.fillStyle = color;
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = currentColor;
};

const handleCanvasClick = () => {
  if (isFilling) {
    fillCanvas();
    isFilling = false;
    modeBtn.innerText = "Fill";
    getSocket().emit(window.events.fill, { color: ctx.fillStyle });
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

export const initializeCanvas = () => {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const handleInitializeClick = () => {
  initializeCanvas();
  getSocket().emit(window.events.initialize);
};

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
export const handleStrokedPath = ({ x, y, color, brushSize }) =>
  strokePath(x, y, color, brushSize);
export const handleFilled = ({ color }) => fillCanvas(color);
export const handleInitialized = () => initializeCanvas();

export const disableCanvas = () => {
  canvas.removeEventListener("mousemove", onMouseMove);
  canvas.removeEventListener("mousedown", startPainting);
  canvas.removeEventListener("mouseup", stopPainting);
  canvas.removeEventListener("mouseleave", stopPainting);
  canvas.removeEventListener("click", handleCanvasClick);
};

export const enableCanvas = () => {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
};

export const hideControls = () => {
  controls.style.opacity = 0;
};

export const showControls = () => {
  controls.style.opacity = 1;
};

// Event Listeners
if (canvas) {
  enableCanvas();
  canvas.addEventListener("contextmenu", handleRightClick);
}
