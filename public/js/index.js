const socket = io();
socket.on('connect',function (){
    console.log("Connected to server");
});
socket.on('disconnect',function (){
    console.log("Disconnected from server");
});
socket.on("newMessage",function(message){
    let newHtml = `<li>${message.from} : ${message.text}`
    document.querySelector('.chat-model').insertAdjacentHTML('beforeend',newHtml)
    console.log("create Message",message);
})

function sentMessage(){
    var text = document.querySelector('#message').value;
    if(text !==""){
        socket.emit('createMessage',{
            from:"user",
            text
        });
    document.querySelector('#message').value ="";
    }
}


document.querySelector('#submit').addEventListener('click',sentMessage);
document.onkeypress= function(e){
    if(e.keyCode ===13) {
        sentMessage();
    }
}

let geoBtn = document.querySelector('.send-location');
geoBtn.addEventListener('click',function(){
    if(!navigator.geolocation){
        alert("Geo location no t supported");
    }
    navigator.geolocation.getCurrentPosition(function (position){
        console.log(position);
        console.log("kush");
        socket.emit('sendGeoLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        })
    },function(){
        alert("unable to fetch");
    })
})