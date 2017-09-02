var ws = new WebSocket("ws://superphage.us:6969/");

var messages = document.getElementById('messages');
var speaker = document.getElementById('speaker');

ws.onmessage = function (event) {
	console.log("Message Incoming: ", event);

	if (event.data instanceof Blob) {
		var speaker = document.getElementById('speaker');
		console.log("Got a voip packet");
		var src = URL.createObjectURL(event.data);
		speaker.src = src;
		speaker.load();
		speaker.play().then(() => {console.log("playback success!");}, () => {console.log("playback failure...");});
	}
	else if (event.data instanceof String) {
		let response = JSON.parse(event.data);
		console.log(response);
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
		else {
			console.error("Malformed message received from server");
		}
	}
	else {
		console.log("Malformed data packet received from server");
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
			var context = new AudioContext();
			
			var source = context.createMediaStreamSource(stream);
			var proc = context.createScriptProcessor(2048, 2, 2);
			source.connect(proc);

			proc.onaudioprocess = function (e) {
				console.log("collecting audio data...")
				var audio_data = e.inputBuffer.getChannelData(0)|| new Float32Array(2048);
				sendVoipPacket(audio_data);
			}

		}).catch(function(error) {
			console.log("Something wicked happened... : "+error);
		});

}
else {
	console.log("No devices found, voip impossible");
}
