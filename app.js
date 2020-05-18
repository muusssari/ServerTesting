const Express = require('express')();
const Http = require('http').Server(Express);
const SocketIO = require('socket.io')(Http);



let data = {
  text: "works"
};
const commentList = [];

SocketIO.on("connection", socket => {
  console.log("socket connected");
  socket.on('disconnect', () => {
    console.log("socket disconnected");
  });

  socket.emit("serverData", data);
  socket.on("NewComment", (data) => {
    commentList.push(data);
  });

  socket.on("CheckLocalComments", (data) => {
    if(commentList.length > 0) {
      //send comments that user doesnt have
      socket.emit("SendComments", commentList);
    }else {
      
      //send all comments from server
    }
  });
});

Http.listen(3000, "0.0.0.0", () => {
  console.log("listening at :3000....");
});

//const comment = new Comment(x.comment, x.Author, x.timestamp, x.pos, x.cameraState, button, this);