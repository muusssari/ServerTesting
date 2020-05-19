const Express = require('express')();
const fs = require('fs');
const http = require('http');
const https = require('https');

const options = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.cert')
};

//const httpServer = http.createServer(Express).listen(3001);
const httpsServer = https.createServer(options, Express).listen(3000, () => {console.log("https: 3000")});

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
    let testObject = {
      text: "works"
    };
    socket.emit("serverData", testObject);

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
/*, "0.0.0.0"
Https.listen(3000, () => {
  console.log("listening at :3000....");
});*/

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