// bulit in modules
const path = require('path');
const http = require('http');

// user define module
const message = require('./utils/message');

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
    socket.emit('newMessage',message.generateMessage('Admin','Welcome to the chat App'))
    socket.broadcast.emit('newMessage',message.generateMessage('Admin','New user join'))
    socket.on('disconnect',()=>{
        console.log("user is disconnected");
    });
    socket.on('createMessage',(messages)=>{
        console.log("message from client : ",messages);
          io.emit('newMessage', message.generateMessage(messages.from,messages.text));
        // socket.broadcast.emit('newMessage', {
        //     from:message.from,
        //     text:message.text,
        //     createdAt: new Date().getTime()
        // })
    })
    
    socket.on('sendGeoLocation',(coords)=>{
        io.emit('geoLocation',message.getLocation('Admin',coords.latitude ,coords.longitude));
    })
})

app.use(express.static(publicPath));

// start  server
server.listen(port,()=>{
    console.log(`server is up on ${port}`);
})