const Express = require('express')();
const Http = require('http').Server(Express);
const SocketIO = require('socket.io')(Http);



let data = {
  text: "works"
};

SocketIO.on("connection", socket => {
  console.log("socket connected");
  socket.emit("serverData", data);
});

Http.listen(3000, "0.0.0.0", () => {
  console.log("listening at :3000....");
});