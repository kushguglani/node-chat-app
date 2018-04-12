const socket = io();
socket.on('connect',function (){
    console.log("Connected to server");
    socket.emit('createMessage',{
        from:'kush',
        text:'thank you so much'
    })
});
socket.on('disconnect',function (){
    console.log("Disconnected from server");
});
socket.on("newMessage",function(message){
    console.log("create Message",message);
})