const socket = io();
var newMessage = 0;
socket.on('connect',function (){
    console.log("Connected to server");
});
socket.on('disconnect',function (){
    console.log("Disconnected from server");
});
socket.on("newMessage",function(message){
    let formattedTime = moment(message.createdAt).format('h:mm:s a');
    var template = document.querySelector('#message-template').innerHTML;
    var html = Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt:formattedTime
    });
    document.querySelector('.chat-model').insertAdjacentHTML('beforeend',html);
    newMessageScroll();
})
socket.on("geoLocation",function(location){
    var formattedTime = moment(location.createdAt).format('h:mm:s a');
    let template = document.querySelector('#location-message-template').innerHTML;
    var newHtml = Mustache.render(template,{
        from:location.from,
        createdAt:formattedTime,
        location:location.url
    })
    document.querySelector('.chat-model').insertAdjacentHTML('beforeend',newHtml);

})

// message sent
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

// send message listener
document.querySelector('#submit').addEventListener('click',sentMessage);
document.onkeypress= function(e){
    if(e.keyCode ===13) {
        sentMessage();
    }
}


// add geo location
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
//on scroll function
function messageShow(){
    var messages = document.querySelector('.chat-model');
    var message = document.querySelectorAll('.message');
    var scrollDown = document.querySelector('.scrollDown');
    var lastmEssage = message[message.length-1];
    var c =messages.clientHeight;
    var m =lastmEssage.clientHeight;
    var t =messages.scrollHeight;
    var u =messages.scrollTop;
    if((t-10) > (c+u) ){
        scrollDown.style.display = 'block';
    }
    else{
        scrollDown.style.display = 'none';    
        newMessage = 0;
        document.getElementById('unread-message').style.display = "none";
        messages.scrollTop =t;
    }
}

function scrollToDown(){
    var messages = document.querySelector('.chat-model');
    var t =messages.scrollHeight;

}

// scroll down when new message

function newMessageScroll(){
    var messages = document.querySelector('.chat-model');
    var message = document.querySelectorAll('.message');
    var lastmEssage = message[message.length-1];
    var c =messages.clientHeight;
    var m =lastmEssage.clientHeight;
    var t =messages.scrollHeight;
    var u =messages.scrollTop;
    var scrollDown =  document.querySelector('.scrollDown');
    if((t-10) - (c+u) < m){
        messages.scrollTop =t;
        newMessage = 0;
        document.getElementById('unread-message').style.display = "none";
    }
    else{
        newMessage++;
        document.getElementById('unread-message').style.display = "block";
        document.getElementById('unread-message').textContent = newMessage;
        console.log(newMessage);
    }
}

// var messages = document.querySelector('.chat-model');
// var message = document.querySelector('.chat-model').childNodes[0];
// console.log(message)
// console.log(messages.clientHeight);
// // console.log(messages.offsetHeight);
// console.log(messages.scrollHeight);
// console.log(message.clientHeight);
