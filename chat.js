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
