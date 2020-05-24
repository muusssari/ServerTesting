const express = require('express');
const App = express();
const fs = require('fs');
const http = require('http');
const https = require('https');

const options = {
  key: fs.readFileSync('./spike-chat.tridify.com.key', 'utf8'),
  cert: fs.readFileSync('./spike-chat.tridify.com.cer', 'utf8')
};

//HTTPS server
const httpsServer = https.createServer(App).listen(3000, "0.0.0.0", () => {
  console.log("http server started port: 3000");
});

const SocketIO = require('socket.io');
const threadList = [];
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
    socket.on('addThreadServer', (thread) => {
      threadList[thread.id] = thread;
      sendThreadToOtherSockets(socket.id, thread);
    });
    socket.on('addCommentServer', (comment) => {
      threadList[comment.threadId].threadComments[comment.id] = comment;
      sendCommentToOtherSockets(socket.id, comment);
    });

    socket.on("CheckLocalComments", (data) => {
      if(threadList.length > 0) {
        //send comments that user doesn't have

        //send all comments if user has none of them
        socket.emit("SendMissingComments", threadList);
      }
    });
  });
}
emitNewOrder(httpsServer);


function sendCommentToOtherSockets(id, data) {
  const sockets = connectedSockets.filter(x => x.id !== id);
  sockets.map(x => {
    x.emit('newCommentClient', data)
  });
}

function sendThreadToOtherSockets(id, data) {
  const sockets = connectedSockets.filter(x => x.id !== id);
  sockets.map(x => {
    x.emit('newThreadClient', data)
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