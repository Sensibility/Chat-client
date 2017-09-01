var ws = new WebSocket("ws://superphage.us:6969/");

var messages = document.getElementById('messages');

ws.onmessage = function (event) {
	console.log("Message Incoming: ", event);
	let response = JSON.parse(event.data);
	if (response.type == 'textmsg') {
		var messages = document.getElementById('messages');
		var message = document.createElement('div');
		var messageContent = document.createElement('span');
		messageContent.className = "messagecontent"; //freaking case-sensitivity is inconsistent smh tbh
		message.className = "message metal";
		var who = document.createElement('span');
		who.className = "username";
		var when = document.createElement('span');
		when.className = "timestamp";
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
	}
	else if(response.type == 'voip') {
		console.log("do voip things");
	}
	else {
		console.error("Malformed message received from server");
	}
};

sendMessage = function () {
	var msg = {
		type: "textmsg",
		text: document.getElementById("compose").value,
	};
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

sendVoipPacket = function (pack) {
	ws.send(pack);
};

//Check for voip capability
if (navigator.mediaDevices) {
	console.log("devices found; attempting voip");

	var constraints = { audio: true };
	var chunks = [];

	navigator.mediaDevices.getUserMedia(constraints).then(
		function(stream) {
			var mediaRecorder = new MediaRecorder(stream);

			mediaRecorder.start(50);

			console.log("Started recording sound. May god have mercy on my soul.");

			mediaRecorder.ondataavailable = function(event) {
				console.log("we got us some audio!");
				
				//TODO - get audio playback working.
				/*audio = document.getElementById('speaker');
				audio.src = URL.createObjectURL(event.data);
				audio.load();
				audio.play();*/

				console.log(event);
				chunks.push(event.data);
				sendVoipPacket(event.data);
			};

			mediaRecorder.onerror = function(event) {
				console.log("Whoops. An accident.");
				console.log(event);
				mediaRecorder.stop();
			};

		}).catch(function(error) {
			console.log("Something wicked happened... : "+error);
		});

}
else {
	console.log("No devices found, voip impossible");
}
