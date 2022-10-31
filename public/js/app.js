var image = document.createElement('img');
image.src = "/images/logo.png";
image.id = "splashScreen";
image.style.position = "absolute"
image.style.width = "100%";
image.style.height = "100%";
image.style.maxWidth = "450px";
image.style.maxHeight = "500px";
image.style.margin = "auto";
image.style.zIndex = "99";
image.style.background = "#fff";
document.getElementById('body').append(image);
//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;

var audioData;

var interval;

var maxRecordLength = 60;
var timer = document.getElementById("timer")
var minute = document.getElementById("minute");
var second = document.getElementById("second");
var record = document.getElementById('record');
var text = document.getElementById('text');

var container = document.getElementById("container");

var reRecordButton = document.getElementById("reRecordButton");
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var submitButton = document.getElementById("submit");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
reRecordButton.addEventListener("click", Rerecording);
stopButton.addEventListener("click", stopRecording);
submitButton.addEventListener("click", onSend);

function startRecording() {
    console.log("recordButton clicked");
    clearRecord();
    /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = {audio: true, video: false}

    /*
        We're using the standard promise based getUserMedia()
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //update the format

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /*
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 2 channels  will double the file size
        */
        rec = new Recorder(input, {numChannels: 1})

        //start the recording process
        rec.record()

        console.log("Recording started");
        /*
       Disable the record button until we get a success or fail from getUserMedia()
   */

        recordButton.disabled = true;
        recordButton.style.display = "none";
        stopButton.disabled = false;
        stopButton.style.display = "block";
        submitButton.disabled = true;
        submitButton.style.display = "none";
        reRecordButton.disabled = true;
        reRecordButton.style.display = "none";
        text.style.display = "none";
        startCountDown();

    }).catch(function (err) {
        //enable the record button if getUserMedia() fails
        recordButton.disabled = false;
        recordButton.style.display = "block";
        text.style.display = "block";
        stopButton.disabled = true;
        stopButton.style.display = "none";
        submitButton.disabled = false;
        submitButton.style.display = "none";
    });
}

function startCountDown() {
    var countdown = maxRecordLength;
    calculateDisplay(countdown);
    timer.style.display = "block";
    container.style.display = "block";
    bar.animate(1.0);  // Number from 0.0 to 1.0
    interval = setInterval(function () {
        if (countdown > 0) {
            countdown--;
        } else {
            stopRecording();
        }
        calculateDisplay(countdown);

    }, 1000)
}

function stopRecording() {
    console.log("stopButton clicked");
    clearInterval(interval);

    //disable the stop button, enable the record to allow for new recordings
    reRecordButton.disabled = false;
    reRecordButton.style.display = "block";
    recordButton.setAttribute('title', 'Record again');
    stopButton.disabled = true;
    stopButton.style.display = "none";
    submitButton.disabled = false;
    submitButton.style.display = "block";

    timer.style.display = "none";
    container.style.display = "none";

    //tell the recorder to stop the recording
    rec.stop();


    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
    bar.set(0);
}

function createDownloadLink(blob) {
    audioData = blob;
    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;
    clearRecord();
    record.appendChild(au);

}

function onSend(e) {
    var name = document.getElementById("name");
    var number = document.getElementById("phoneNumber");
    var filename = new Date().toISOString();
    if (!audioData) {
        alert("please record a message");
    }

    var xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
        console.log(e);
//         if (this.readyState === 4) {
//             alert("thanks for your message");
//             document.getElementById("body").innerHTML=`<div>
// <p>Thank you for your time</p>
// <button onclick="window.close();">close</button>
// </div>`;
//             window.close();
//         }
    };
    xhr.onprogress = function (e) {
        console.log(`${e.type}: ${e.loaded} bytes transferred`);
    }
    xhr.onerror = function (e) {
        console.log("error", e)
    }
    xhr.onabort = function (e) {
        console.log("abort", e);
    }
    var fd = new FormData;
    console.log(audioData);
    fd.append("audio_data", audioData, filename);
    fd.append("name", name.value);
    fd.append("number", number.value);
    xhr.open("POST", "/api/upload", true);
    xhr.send(fd);
    submitButton.disabled = true;
    submitButton.style.display = "none";
}

function calculateDisplay(s) {
    var minutes = Math.floor(s / 60);
    if (minutes < 10)
        minutes = "0" + minutes;
    var seconds = s % 60;
    if (seconds < 10)
        seconds = "0" + seconds
    minute.innerText = minutes;
    second.innerText = seconds;
}

function Rerecording() {
    clearRecord();
    recordButton.disabled = false;
    recordButton.style.display = "block";
    stopButton.disabled = true;
    stopButton.style.display = "none";
    submitButton.disabled = true;
    submitButton.style.display = "none";
    reRecordButton.disabled = true;
    reRecordButton.style.display = "none";
}

function clearRecord() {
    if (record.firstChild) {
        record.firstChild.remove();
    }
}
