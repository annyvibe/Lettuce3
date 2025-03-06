let handPose;
let video;
let hands = [];
let lettuceVideo;

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

    // Request full screen
    requestFullScreen();
    let startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        if (lettuceVideo && lettuceVideo.elt.paused) {
            lettuceVideo.loop();
            lettuceVideo.volume(100);
        }
        startButton.style.display = 'none'; // Hide the button after starting
    });

}
function touchStarted() {
    if (lettuceVideo && lettuceVideo.elt.paused) {
        lettuceVideo.loop();
        lettuceVideo.volume(1);
    }
    return false; // Prevent default
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

// 处理手势数据
function gotHands(results) {
    hands = results;
}

// 全屏功能
function requestFullScreen() {
    let elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
}

function touchStarted() {
    if (lettuceVideo) {
        lettuceVideo.play();
    }
}