let handPose;
let video;
let hands = [];
let lettuceVideo;

function preload() {
    handPose = ml5.handPose();
}

let webcam

function setup() {
    createCanvas(windowWidth, windowHeight);

    webcam = createCapture(VIDEO);
    webcam.size(windowWidth, windowHeight);
    webcam.hide();

    lettuceVideo = createVideo(['assets/Lettuce.mp4']);
    lettuceVideo.elt.setAttribute('playsinline', 'playsinline')
    lettuceVideo.size(windowWidth, windowHeight);
    lettuceVideo.hide();
    lettuceVideo.volume(0);

    handPose.detectStart(webcam, gotHands);

    let startButton = document.getElementById('startButton');
    startButton.addEventListener('click', function () {
        startButton.style.display = 'none';
        startVideo();
    });
    startButton.addEventListener('touchstart', function () {
        startButton.style.display = 'none';
        startVideo();
    });

    // let fullscreenButton = document.createElement('button');
    // fullscreenButton.id = 'fullscreenButton';
    // fullscreenButton.textContent = 'Enter Fullscreen';
    // fullscreenButton.style.position = 'absolute';
    // fullscreenButton.style.top = '10px';
    // fullscreenButton.style.right = '10px';
    // document.body.appendChild(fullscreenButton);

    // fullscreenButton.addEventListener('click', function () {
    //     requestFullScreen();
    //     fullscreenButton.style.display = 'none';
    // });
    // fullscreenButton.addEventListener('touchstart', function () {
    //     requestFullScreen();
    //     fullscreenButton.style.display = 'none';
    // });

}
function requestMotionAccess() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleMotion);
                }
            })
            .catch(console.error);
    } else {
        // Handle non-iOS 13+ devices
    }
}

function startVideo() {
    if (lettuceVideo && lettuceVideo.elt.paused) {
        lettuceVideo.loop();
        lettuceVideo.volume(1);
    }
}

// function touchStarted() {
//     if (lettuceVideo && lettuceVideo.elt.paused) {
//         lettuceVideo.loop();
//         lettuceVideo.volume(1);
//     }
//     return false;
// }

let pinch = 0
let speed = 0
function draw() {
    image(lettuceVideo, 0, 0, width, height);

    // image(webcam, 0, 0, 120, 100)

    // fill(255, 25, 25)
    // text(pinch.toFixed(0), 16, 16)
    // text(speed, 16, 32)

    if (hands.length > 0) {
        let finger = hands[0].index_finger_tip;
        let thumb = hands[0].thumb_tip;
        pinch = dist(finger.x, finger.y, thumb.x, thumb.y);
        speed = map(pinch, 0, 700, 3, 0.1, true);
        speed = speed.toFixed(1)

        lettuceVideo.elt.playbackRate = speed
    } else {
        lettuceVideo.elt.playbackRate = 1
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