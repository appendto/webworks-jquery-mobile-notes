var audio = ( function() {

	if ( !blackberry ) {
		// Don't error in desktop browsers
		return {};
	}

	var microphone = blackberry.media.microphone, 
	audioDirectory = blackberry.io.dir.appDirs.shared.music.path;

	function exists( filename ) {
		return blackberry.io.file.exists( filename );
	}

	function record(success, error) {
		var filename = audioDirectory + "/" + currentDate() + ".wav";

		if( !exists(filename) ) {
			try {
				var la = microphone.record( filename, success, error);
			} catch(e) {
				error( -1, "Problem starting recording" )
			}
		} else {
			error(-1, "File already exists, cannot record" );
		}

	}

	function stop() {
		try {
			microphone.stop();
		} catch(e) {
			console.log("could not stop: " + e);
		}
	}

	function pause() {
		try {
			microphone.pause();
		} catch(e) {
			console.log("could no pause: " + e);
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
