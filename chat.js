var ws = new WebSocket("ws://superphage.us:6969/");
var messages = document.getElementById('messages');
ws.onmessage = function (event) {
	var messages = document.getElementById('messages');
	var message = document.createElement('div');
	message.className = "message"
	var content = document.createTextNode(event.data);
	message.appendChild(content);
	messages.appendChild(message);
};
sendMessage = function () {
	var msg = {
		type: "textmsg",
		text: document.getElementById("compose").value,
		date: Date.now()
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
	console.log(nickname)
	var msg = {
		type: "login",
		text: nickname,
		date: Date.now()
	}
	ws.send(JSON.stringify(msg))
	document.getElementById("nickname_modal").style.display = "none";
}
