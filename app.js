const express = require('express');
const App = express();
const fs = require('fs');
const https = require('https');

const options = {
  key: fs.readFileSync('./spike-chat.tridify.com.key', 'utf8'),
  cert: fs.readFileSync('./spike-chat.tridify.com.cer', 'utf8')
};

//HTTPS server
const httpsServer = https.createServer(options, App).listen(3000, "0.0.0.0", () => {
  console.log("http server started port: 3000");
});

const SocketIO = require('socket.io');
const commentList = [];
const connectedSockets = [];

function emitNewOrder(server) {
  const io = SocketIO.listen(server);

  //Test data, so client is connected to server right
  

  io.on("connection", socket => {
    console.log("socket connected");
    connectedSockets.push(socket);
    socket.on('disconnect', () => {
      console.log("socket disconnected");
      removeA(connectedSockets, socket);
    });
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
}
emitNewOrder(httpsServer);


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