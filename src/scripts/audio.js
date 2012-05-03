var audio = ( function() {

	var microphone = blackberry.media.microphone, 
	audioDirectory = blackberry.io.dir.appDirs.shared.music.path;

	function check(newfile) {
		if(blackberry.io.file.exists(audioDirectory + "/" + newfile + ".wav")) {
			return false;
		} else {
			return true;
		}
	}

	function record(filename) {
		if(check(filename)) {
			try {
				var la = microphone.record(audioDirectory + '/' + filename + ".wav", recordSuccess, recordError);
			} catch(e) {
				console.log("error initializing Recording: " + e.message);
			}
		}else{
			console.log("File already exists, cannot record");
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
	
	function currentDate(){
		var date = new Date(),
		day = date.getDay(),
		hour = date.getHours(),
		minute = date.getMinutes(),
		month = date.getMonth(),
		year = date.getFullYear();
		return year + "-" + month + "-" + day + "-" + hour + "-" + minute;
	}

	function recordSuccess(data) {
		console.log("Recording Success");		
		store(currentDate(), data);
	}

	function recordError(error, msg) {
		console.log("error: " + error);
		console.log("error Message: " + msg);
	}

	function store(name, data) {
		if(localStorage.getItem(name) === null) {
			localStorage.setItem(name, data);
			console.log("stored " + name);
		} else {
			console.log(name + " already exists!");
		}

	}

	function list() {
		var keysLen = localStorage.length, audioList = {};
		for(var i = 0; i < keysLen; i++) {
			audioList[i] = {
				"name" : localStorage.key(i),
				"file" : localStorage.getItem(localStorage.key(i))
			};
		}
		return audioList;
	}

	//returns an audio player element based on the name of the note you send in
	function getAudio(name) {
		var audioFile = localStorage.getItem(name), audioPlayer = document.createElement("audio");
		audioPlayer.src = audioFile;
		audioPlayer.controls = true;
		return audioPlayer;
	}

	return {
		record : record,
		stop : stop,
		pause : pause,
		listAudio : list,
		getAudio : getAudio
	};

}());
