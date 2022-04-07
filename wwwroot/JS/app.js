'use strict';

/* globals MediaRecorder */
let mediaRecorder;
let recordedBlobs;

const errorMsgElement = document.querySelector('span#errorMsg');
const countdown = document.querySelector('h3#countdown');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');
const playButton = document.querySelector('button#play');
const downloadButton = document.querySelector('button#download');
const sendButton = document.querySelector('button#send');
const progressbar = document.querySelector('progress#progressBar');
const timerRec = document.querySelector('p#timer');

recordButton.addEventListener('click', () => {
    if (recordButton.textContent === 'Grabar') {
        prevTimerRec();
        const startRecordingCountdown = setTimeout(startRecording, 3000);
        const recordCountdown = setTimeout(stopRecording, 13000);
    } else {
        stopRecording();
        progressbar.value = 10;
        progressbar.style.display = 'none';
    }
});


playButton.addEventListener('click', () => {
        const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
        recordedVideo.src = null;
        recordedVideo.srcObject = null;
        recordedVideo.src = window.URL.createObjectURL(superBuffer);
        recordedVideo.controls = true;
    if (playButton.textContent === 'Reproducir') {
        playButton.textContent = 'Pausar';
        recordedVideo.play();
    } else {
        playButton.textContent = 'Reproducir';
        recordedVideo.pause();
        playButton.disabled = false;
        downloadButton.disabled = false;
        sendButton.disabled = false;

    }
    
});


downloadButton.addEventListener('click', () => {
    const blob = new Blob(recordedBlobs, { type: 'video/mp4' });
    alert(blob);
    const url = window.URL.createObjectURL(blob);
    alert(url);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'w3-coder-recorder-test.mp4';
    document.body.appendChild(a);
    a.click();
});

sendButton.addEventListener('click', () => {
    let userTeams = userPrincipalName;
    let idSolicitud = requestId;
    const blob = new Blob(recordedBlobs, { type: 'video/mp4' });
    let formData = new FormData();
    formData.append("video", blob);

    fetch('https://localhost:52250/api/EnvVideo?userTeams=' + userPrincipalName + '&id=' + requestId, {
        method: "POST", body: formData
    })
        //.then((reponse) => response.text())
        //.then((response) => {
        //    console.log(response);
        //});
});

function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function recordingProgressBar() {
    let timeleft = 9;
    progressbar.style.display = 'block';
    progressbar.value = 0;
    let recordTimer = setInterval(function () {
        if (timeleft <= 0 || progressbar.style.display === 'none') {
            clearInterval(recordTimer);
        }
        progressbar.value = 10 - timeleft;
        timeleft -= 1;
    }, 1000);
}

function hidePrevTimer() {
    timerRec.fadeOut(1000);
}

function prevTimerRec() {
    let segundos = 3;
    timerRec.innerHTML = segundos;
        let timeleft2 = 1;
        timerRec.style.display = 'block';
        let recordTimer = setInterval(function () {
            if (timeleft2 >= 3 || timerRec.style.display === 'none') {
                clearInterval(recordTimer);
            }
            timerRec.innerHTML = segundos - timeleft2;
            timeleft2 += 1;
        }, 1000);
    const hidingPrevTimer = setTimeout(hidePrevTimer, 3000);
}



function startRecording() {
    recordedBlobs = [];
    let options = { mimeType: 'video/webm;codecs=vp9,opus' };
    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
        return;
    }

    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = 'Parar';
    playButton.disabled = true;
    downloadButton.disabled = true;
    sendButton.disabled = true;

    mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped: ', event);
        console.log('Recorded Blobs: ', recordedBlobs);
    };
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    recordingProgressBar();
    console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
    mediaRecorder.stop();
    recordButton.textContent = 'Grabar';
    playButton.disabled = false;
    downloadButton.disabled = false;
    sendButton.disabled = false;
    progressbar.style.display = 'none';

}

function handleSuccess(stream) {
    recordButton.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    window.stream = stream;

    const gumVideo = document.querySelector('video#gum');
    gumVideo.srcObject = stream;
}

async function init(constraints) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (e) {
        console.error('navigator.getUserMedia error:', e);
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
}



async function camOn() {
    const constraints = {
        audio: {
            echoCancellation: true
        },
        video: {
            width: 1280, height: 720
        }
    };
    console.log('Using media constraints:', constraints);
    await init(constraints);
};

camOn();
