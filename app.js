const express = require('express');
const App = express();
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

//Default Test server
App.use('/', express.static(path.join(__dirname, '.', 'client')))
/*
http.createServer(App).listen('3001', () => {
  console.log("running server 3001")
});
//-------------------------------- */

const options = {
  key: fs.readFileSync(path.join('./server.crt')),
  cert: fs.readFileSync(path.join('./server.cert'))
};

https.createServer(options, App)
  .listen('3000', () => {
    console.log("running server 3000 https");
  })

//const httpServer = http.createServer(App).listen(3001);
//const httpsServer = https.createServer(options, App).listen(3000, () => {console.log("https: 3000")});


/*https.createServer(options,App).listen(5000, () => {
  console.log("5000 open")
});*/


 /*

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