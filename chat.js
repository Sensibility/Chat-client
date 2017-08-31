var ws = new WebSocket("ws://superphage.us:6969/");
var messages = document.getElementById('messages');
ws.onmessage = function (event) {
    console.log("Message Incoming: ", event);
    var messages = document.getElementById('messages');
    var message = document.createElement('div');
    var messageContent = document.createElement('span');
    messageContent.className = "messagecontent"; //freaking case-sensitivity is inconsistent smh tbh
    message.className = "message";
    var who = document.createElement('span');
    who.className = "username";
    var when = document.createElement('span');
    when.className = "timestamp";
    response = JSON.parse(event.data);
    var content = document.createTextNode(response.text);
    var userContent = document.createTextNode(response.sender);
    var hour = (new Date(response.date)).getHours();
    var minute = (new Date(response.date)).getMinutes();
    var timeContent = document.createTextNode('@ '+String(hour)+':'+String(minute));
    who.appendChild(userContent);
    message.appendChild(who);
    when.appendChild(timeContent);
    message.appendChild(when);
    messageContent.appendChild(content);
    message.appendChild(messageContent);
    messages.appendChild(message);
};
sendMessage = function () {
    var msg = {
        type: "textmsg",
        text: document.getElementById("compose").value,
        date: new Date()
    }
    ws.send(JSON.stringify(msg));
    document.getElementById("compose").value = "";
}

setNickname = function () {
    var nickname = document.getElementById("nickname").value.replace('\n','').replace('\r','');
    document.getElementById("nickname").value = "";
    if (!nickname) {
        return false;
    }
    var msg = {
        type: "login",
        text: nickname,
        date: Date.now()
    }
    ws.send(JSON.stringify(msg))
    document.getElementById("nickname_modal").style.display = "none";
}