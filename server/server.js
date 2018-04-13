// bulit in modules
const path = require('path');
const http = require('http');

// 3rd party modules
const express = require('express');
const socketIO = require('socket.io');
// constant variables
const app = express();
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const maintainance = false;// make it true when site is on maintainance
const server = http.createServer(app);//create http server
const io = socketIO(server);

// maintainance code
app.use((req,res,next)=>{
    if(maintainance){
        res.sendFile(publicPath+'/maintainance.html');
    }
    else
        next();
})

io.on('connection',(socket)=>{
    console.log("New user connected");
    socket.on('disconnect',()=>{
        console.log("user is disconnected");
    });
    socket.on('createMessage',(message)=>{
        console.log("message from client : ",message);
          io.emit('newMessage', {
            from:message.from,
            text:message.text,
            createdAt: new Date().getTime()
        })
    })
})

app.use(express.static(publicPath));

// start  server
server.listen(port,()=>{
    console.log(`server is up on ${port}`);
})