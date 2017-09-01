var ws = new WebSocket("ws://superphage.us:6969/");
var messages = document.getElementById('messages');
ws.onmessage = function (event) {
	console.log("Message Incoming: ", event);
	var messages = document.getElementById('messages');
	var message = document.createElement('div');
	var messageContent = document.createElement('span');
	messageContent.className = "messagecontent"; //freaking case-sensitivity is inconsistent smh tbh
	message.className = "message metal";
	var who = document.createElement('span');
	who.className = "username";
	var when = document.createElement('span');
	when.className = "timestamp";
	response = JSON.parse(event.data);
	var timestamp = new Date(parseFloat(response.date)*1000.0)
	var content = document.createTextNode(response.text);
	var userContent = document.createTextNode(response.sender);
	var timeContent = document.createTextNode('@ '+timestamp.getHours()+':'+timestamp.getMinutes()+' - ');
	who.appendChild(userContent);
	message.appendChild(who);
	when.appendChild(timeContent);
	message.appendChild(when);
	messageContent.appendChild(content);
	message.appendChild(messageContent);
	messages.appendChild(message);
	messages.scrollTop = messages.scrollHeight;
};
sendMessage = function () {
	var msg = {
		type: "textmsg",
		text: document.getElementById("compose").value,
	}
	ws.send(JSON.stringify(msg));
	document.getElementById("compose").value = "";
};

setNickname = function () {
	var nickname = document.getElementById("nickname").value.replace('\n','').replace('\r','');
	document.getElementById("nickname").value = "";
	if (!nickname) {
		return false;
	}
	var msg = {
		type: "login",
		text: nickname,
	}
	ws.send(JSON.stringify(msg))
	document.getElementById("nickname_modal").style.display = "none";
};

//Check for voip capability
if (navigator.mediaDevices) {
	console.log("devices found; attempting voip");

	var constraints = { audio: true };
	var chunks = [];

	navigator.mediaDevices.getUserMedia(constraints).then(
		function(stream) {
			var mediaRecorder = new MediaRecorder(stream);

			mediaRecorder.start();

			console.log("Started recording sound. May god have mercy on my soul.");

			mediaRecorder.ondataavailable = function(event) {
				console.log("we got us some audio!");
				console.log(event);
				console.log(event.data);
				chunks.push(event.data);
			};

		}).catch(function(error) {
			console.log("Something wicked happened... : "+error);
		});

}
else {
	console.log("No devices found, voip impossible");
}
