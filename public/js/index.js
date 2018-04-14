const socket = io();
socket.on('connect',function (){
    console.log("Connected to server");
});
socket.on('disconnect',function (){
    console.log("Disconnected from server");
});
socket.on("newMessage",function(message){
    let newHtml = `<li>${message.from} : ${message.text}`;
    document.querySelector('.chat-model').insertAdjacentHTML('beforeend',newHtml);
    console.log("create Message",message);
})
socket.on("geoLocation",function(location){
    let newHtml = ` <li>${location.from} :<a target="_blank" href=${location.url}>Location</a></li>`;
    document.querySelector('.chat-model').insertAdjacentHTML('beforeend',newHtml);

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
let locIcon = document.querySelector('#loc-icon');
geoBtn.addEventListener('click',function(){
    if(!navigator.geolocation){
        alert("Geo location no t supported");
    }
    geoBtn.classList.add('disabled');
    geoBtn.disabled = true;
    locIcon.classList.add('ion-android-locate');
    locIcon.classList.remove('ion-ios-location-outline');
    navigator.geolocation.getCurrentPosition(function (position){
    geoBtn.classList.remove('disabled');
    locIcon.classList.remove('ion-android-locate');
    locIcon.classList.add('ion-ios-location-outline');
    geoBtn.disabled = false;
        socket.emit('sendGeoLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        })
    },function(){
        geoBtn.classList.remove('disabled');
        geoBtn.disabled = false;
        locIcon.classList.remove('ion-android-locate');
        locIcon.classList.add('ion-ios-location-outline');
        alert("unable to fetch");
    })
})