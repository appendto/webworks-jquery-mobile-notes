var audio = ( function() {

	if ( !window.blackberry ) {
		// Don't error in desktop browsers
		return {};
	}

	// <Add code here>

	function stop() {
		try {
			microphone.stop();
		} catch(e) {
			console.log("could not stop", e);
		}
	}

	function pause() {
		try {
			microphone.pause();
		} catch(e) {
			console.log("could not pause", e);
		}
	}
	
	function currentDate() {
		var date = new Date(),
		day = date.getDay(),
		hour = date.getHours(),
		minute = date.getMinutes(),
		month = date.getMonth(),
		second = date.getSeconds(),
		year = date.getFullYear();
		return [ year, month, day, hour, minute, second ].join( "-" );
	}

	//returns an audio player element based on the name of the note you send in
	function getAudio(filename) {
		var audioFile = filename, audioPlayer = document.createElement("audio");
		audioPlayer.src = audioFile;
		audioPlayer.controls = true;
		return audioPlayer;
	}

	return {
		record : record,
		stop : stop,
		pause : pause,
		getAudio : getAudio
	};

}());
