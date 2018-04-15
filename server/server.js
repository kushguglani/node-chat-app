// bulit in modules
const path = require('path');
const http = require('http');

// user define module
const message = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

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
const user =  new Users();

// maintainance code
app.use((req,res,next)=>{
    if(maintainance){
        res.sendFile(publicPath+'/maintainance.html');
    }
    else
        next();
})

// connection starts
io.on('connection',(socket)=>{
    // new user join
    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room no cant be empty');
        }
        socket.join(params.room);
        user.removeUser(socket.id);
        user.addUser(socket.id,params.name,params.room);
        io.to(params.room).emit('updateUserList',user.getUserList(params.room));
        // admin default mesages
        socket.broadcast.to(params.room).emit('newMessage',message.generateMessage('Admin',`${params.name} has Joined`));
        socket.emit('newMessage',message.generateMessage('Admin',`Welcome to the ${params.room} chat Room`));
    });
    // send message
    socket.on('createMessage',(messages)=>{
        var user1 = user.fetchUser(socket.id);
          io.to(user1.room).emit('newMessage', message.generateMessage(user1.name,messages.text));

    
    })
    //send location 
    socket.on('sendGeoLocation',(coords)=>{
        var user1 = user.fetchUser(socket.id);
        io.to(user1.room).emit('geoLocation',message.getLocation(user1.name,coords.latitude ,coords.longitude));
    })


    // user disconnect 
    socket.on('disconnect',()=>{
        var userRemove = user.removeUser(socket.id);
        if(userRemove){
            io.to(userRemove.room).emit('updateUserList',user.getUserList(userRemove.room));
            io.to(userRemove.room).emit('newMessage',message.generateMessage('Admin', `${userRemove.name} has left`));
        }
    });
})

app.use(express.static(publicPath));

// start  server
server.listen(port,()=>{
    console.log(`server is up on ${port}`);
})