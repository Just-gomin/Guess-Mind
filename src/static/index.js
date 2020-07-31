const socket = io("/");

// hello event 발생시 처리
socket.on("hello", () => console.log("Sombody Joined."));

setTimeout(() => socket.emit("helloGuys"), 4000);
