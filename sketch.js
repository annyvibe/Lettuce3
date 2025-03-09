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

    lettuceVideo = createVideo(['assets/Lettuce.mp4']);
    lettuceVideo.size(windowWidth, windowHeight);
    lettuceVideo.hide();
    lettuceVideo.volume(0);

    handPose.detectStart(webcam, gotHands);

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
function onClick() {
    // feature detect
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', () => { });
                }
            })
            .catch(console.error);
    } else {
        // handle regular non iOS 13+ devices
    }
}

function onClick() {
    // feature detect
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', () => { });
                }
            })
            .catch(console.error);
    } else {
        // handle regular non iOS 13+ devices
    }
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

    if (hands.length > 0) {
        let finger = hands[0].index_finger_tip;
        let thumb = hands[0].thumb_tip;
        let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);
        let speed = map(pinch, 0, 700, 0.5, 2);
        // console.log(pinch);
        lettuceVideo.speed(speed);
    } else {
        lettuceVideo.speed(1);
    }
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