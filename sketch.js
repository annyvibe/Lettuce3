let handPose;
let video;
let hands = [];
let lettuceVideo;
let lastTap = 0;
let fullscreenMode = false;

function preload() {
    handPose = ml5.handPose();
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    let webcam = createCapture(VIDEO);
    webcam.size(windowWidth, windowHeight);
    webcam.hide();

    // Modify video creation
    lettuceVideo = createVideo(['assets/Lettuce.mp4']);
    lettuceVideo.size(windowWidth, windowHeight);
    lettuceVideo.hide();
    lettuceVideo.loop();
    lettuceVideo.volume(0); // Start muted

    // Start hand gesture recognition
    handPose.detectStart(webcam, gotHands);

    let startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startVideo);
}

function startVideo() {
    if (lettuceVideo && lettuceVideo.elt.paused) {
        lettuceVideo.loop();
        lettuceVideo.volume(1);
        document.getElementById('startButton').style.display = 'none';
    }
}

function draw() {
    image(lettuceVideo, 0, 0, width, height);

    if (hands.length > 0) {
        let finger = hands[0].index_finger_tip;
        let thumb = hands[0].thumb_tip;
        let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);
        let speed = map(pinch, 30, 150, 0.1, 2);
        lettuceVideo.speed(speed);
    } else {
        lettuceVideo.speed(1);
    }
}

function gotHands(results) {
    hands = results;
}

function touchEnded() {
    let currentTime = millis();
    if (currentTime - lastTap < 300) { // Double tap detected
        toggleFullScreen();
    }
    lastTap = currentTime;
}

function toggleFullScreen() {
    let fs = fullscreen();
    fullscreen(!fs);
    fullscreenMode = !fs;
}

function touchStarted() {
    if (lettuceVideo && lettuceVideo.elt.paused) {
        lettuceVideo.loop();
        lettuceVideo.volume(1);
    }
    return false; // Prevent default
}
