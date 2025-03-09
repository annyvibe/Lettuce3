let handPose;
let video;
let hands = [];
let lettuceVideo;
let targetSpeed = 1;
let currentSpeed = 1;


function preload() {
    handPose = ml5.handPose;
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    video = createCapture(VIDEO);
    video.size(windowWidth, windowHeight);
    video.hide();

    handPose = ml5.handPose(video, modelReady);
    handPose.on("predict", gotHands);

    lettuceVideo = createVideo(['assets/Lettuce.mp4']);
    lettuceVideo.size(windowWidth, windowHeight);
    lettuceVideo.hide();
    lettuceVideo.volume(0);

    let startButton = document.getElementById('startButton');
    startButton.addEventListener('click', function () {
        startButton.style.display = 'none';
        startVideo();
    });


    let fullscreenButton = document.createElement('button');
    fullscreenButton.id = 'fullscreenButton';
    fullscreenButton.textContent = 'Enter Fullscreen';
    fullscreenButton.style.position = 'absolute';
    fullscreenButton.style.top = '10px';
    fullscreenButton.style.right = '10px';
    document.body.appendChild(fullscreenButton);

    fullscreenButton.addEventListener('click', function () {
        requestFullScreen();
        fullscreenButton.style.display = 'none';
    });
}

function modelReady() {
    console.log("HandPose model ready!");
}

function startVideo() {
    if (lettuceVideo && lettuceVideo.elt.paused) {
        lettuceVideo.loop();
        lettuceVideo.volume(1);
    }
}

function touchStarted() {
    if (lettuceVideo && lettuceVideo.elt.paused) {
        lettuceVideo.loop();
        lettuceVideo.volume(1);
    }
    return false;
}

function draw() {
    image(lettuceVideo, 0, 0, width, height);

    if (hands.length > 0 && frameCount % 24 === 0) {
        let finger = hands[0].annotations.indexFinger[3];
        let thumb = hands[0].annotations.thumb[3];
        let pinch = dist(finger[0], finger[1], thumb[0], thumb[1]);
        targetSpeed = constrain(map(pinch, 10, 200, 0.1, 2), 0.1, 2);
    }
    console.log(pinch);
    currentSpeed = lerp(currentSpeed, targetSpeed, 0.1);
    lettuceVideo.speed(currentSpeed);
}


function gotHands(results) {
    hands = results;
}


function requestFullScreen() {
    let elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
}