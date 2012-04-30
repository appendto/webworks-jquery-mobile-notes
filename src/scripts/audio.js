var audio = ( function() {

        var microphone = blackberry.media.microphone;

        //this creates a new file but keeps the same name, so you can only play the most recent recording for {note name}
        //however you can go in and play audio from the files list, so all your previous recordings are still there.
        function check(newfile) {
            var incr = localStorage.getItem("incr") || 1;
            if(blackberry.io.file.exists(blackberry.io.dir.appDirs.shared.music.path + "/" + newfile + ".wav")) {
                newfile = newfile + "_" + incr;
                localStorage.setItem("incr", ++incr);
                return newfile;
            } else {
                return newfile;
            }
        }

        function record(filename) {
            try {
                var la = microphone.record(blackberry.io.dir.appDirs.shared.music.path + '/' + check(filename) + ".wav", recordSuccess, recordError);
            } catch(e) {
                console.log("error initializing Recording: " + e.message);
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
                console.log("could no pause: " + e)
            }
        }

        function recordSuccess(data) {
            //grabs the name of the file before the underscore, notes can only have dashes in their name
            var regex = /music\/([a-zA-Z0-9-^*#!@#$%&()]*)/, name = data.match(regex)[1];
            store(name, data);
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
                audioList.int = {
                    "name" : localStorage.key(i),
                    "file" : localStorage.getItem(audioList.name)
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
            record: record,
            stop: stop,
            pause: pause,
            listAudio: list,
            getAudio: getAudio
        };

    }());

