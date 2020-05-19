const Express = require('express')();
const Http = require('http').Server(Express);
const SocketIO = require('socket.io')(Http);


//Test data, so client is connected to server right
let data = {
  text: "works"
};
const commentList = [];
const connectedSockets = [];

SocketIO.on("connection", socket => {
  console.log("socket connected");
  connectedSockets.push(socket);
  socket.on('disconnect', () => {
    console.log("socket disconnected");
    removeA(connectedSockets, socket);
  });

  socket.emit("serverData", data);
  socket.on('addCommentServer', (data) => {
    commentList.push(data);
    sendCommentToOtherSockets(socket.id, data);
  });
  socket.on('addThreadServer', (data) => {
    commentList[data.mainId].threadCommentList.push(data);
    sendThreadToOtherSockets(socket.id, data);
  });

  socket.on("CheckLocalComments", (data) => {
    if(commentList.length > 0) {
      //send comments that user doesnt have

      //send all comments if user has none of them
      socket.emit("SendMissingComments", commentList);
    }
  });
});

function sendThreadToOtherSockets(id, data) {
  const sockets = connectedSockets.filter(x => x.id !== id);
  sockets.map(x => {
    x.emit('addThreadClient', data)
  });
}

function sendCommentToOtherSockets(id, data) {
  const sockets = connectedSockets.filter(x => x.id !== id);
  sockets.map(x => {
    x.emit('newCommentClient', data)
  });
}

Http.listen(3000, "0.0.0.0", () => {
  console.log("listening at :3000....");
});

//const comment = new Comment(x.comment, x.Author, x.timestamp, x.pos, x.cameraState, button, this);


function removeA(arr) {
  var what, a = arguments, L = a.length, ax;
  while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax= arr.indexOf(what)) !== -1) {
          arr.splice(ax, 1);
      }
  }
  return arr;
}