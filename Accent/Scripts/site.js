function showError(err) {
    var element = document.getElementById('error');
    
    element.innerText = err;
    element.style.display = '';
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

function canPlayAudio() {
    var a = document.createElement('audio');
    return !!(a.canPlayType && a.canPlayType('audio/wav; codecs="1"').replace(/no/, ''));
}

function ajax(url, data, mode) {
    if (mode === undefined)
        mode = 'GET';

    if (typeof data === 'object')
        data = JSON.stringify(data);

    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open(mode, url);
        if (data !== undefined)
            req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

        req.onload = function () {
            if (req.status == 200)
                resolve(req.response);
            else
                reject(Error(req.statusText));
        };

        req.onerror = function () {
            reject(Error("Network error"));
        };

        req.send(data);
    });
}

var pronunciation = null;

function loadPronunciation() {
    var text = document.getElementById('textToSpeak').value.trim();
    var accent = document.getElementById('speechAccent').value;

    if (text == '' || accent == '') {
        pronunciation = null;
        return;
    }

    var data = { text: text, accent: 1 };
    pronunciation = ajax(pronunciationUrl, data, 'POST');
}

function displayText(pronunciation) {
    var output = document.getElementById('speechOutput');
    output.style.display = '';
    output.innerText = pronunciation;

    return pronunciation;
}

function speakText(pronunciation) {
    console.log('speaking...', pronunciation);
}

function speechFormSubmitted() {
    if (pronunciation == null && !loadPronunciation()) {
        showError('Enter text and pick an accent to continue');
        return;
    }
    hideError();

    var loading = document.getElementById('loading');
    loading.style.display = '';

    pronunciation
        .then(displayText)
        .then(speakText)
        .catch(showError)
        .then(function () {
            loading.style.display = 'none';
        });
}

if (!canPlayAudio()) {
    document.getElementById('speech').style.display = 'none';
    document.getElementById('error').style.display = '';
}

document.getElementById('btnSpeak').addEventListener('click', speechFormSubmitted);
document.getElementById('textToSpeak').addEventListener('change', loadPronunciation);
document.getElementById('speechAccent').addEventListener('change', loadPronunciation);