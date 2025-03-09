let handPose;
let video;
let hands = [];
let lettuceVideo;

let detectionInterval = 5;  // 每 5 帧检测一次手势
let frameCounter = 0;
let wakeLock = null; // iPad 省电模式锁

function preload() {
    handPose = ml5.handPose();
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL); // 使用 WebGL 加速渲染

    let webcam = createCapture(VIDEO);
    webcam.size(windowWidth / 2, windowHeight / 2);  // 降低摄像头分辨率，减少计算负担
    webcam.hide();

    // 创建视频
    lettuceVideo = createVideo(['assets/Lettuce.mp4']);
    lettuceVideo.size(windowWidth / 2, windowHeight / 2);  // 降低解析度
    lettuceVideo.hide();
    lettuceVideo.volume(0); // 开始时静音

    // 绑定手势检测
    handPose.detectStart(webcam, gotHands);

    // 创建开始按钮
    let startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.textContent = 'Start Video';
    startButton.style.position = 'absolute';
    startButton.style.top = '10px';
    startButton.style.left = '10px';
    document.body.appendChild(startButton);

    startButton.addEventListener('click', function () {
        startButton.style.display = 'none'; // 隐藏按钮
        startVideo();
    });

    // 创建全屏按钮
    let fullscreenButton = document.createElement('button');
    fullscreenButton.id = 'fullscreenButton';
    fullscreenButton.textContent = 'Enter Fullscreen';
    fullscreenButton.style.position = 'absolute';
    fullscreenButton.style.top = '10px';
    fullscreenButton.style.right = '10px';
    document.body.appendChild(fullscreenButton);

    fullscreenButton.addEventListener('click', function () {
        requestFullScreen();
        fullscreenButton.style.display = 'none'; // 点击后隐藏全屏按钮
    });

    // 监听 iPad 省电模式
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

function startVideo() {
    if (lettuceVideo && lettuceVideo.elt.paused) {
        lettuceVideo.loop();
        lettuceVideo.volume(1);
        requestWakeLock(); // 防止 iPad 省电模式
    }
}

function draw() {
    background(0);
    image(lettuceVideo, -width / 2, -height / 2, width, height); // 适配 WebGL 坐标

    if (hands.length > 0) {
        let landmarks = hands[0].landmarks;
        let finger = landmarks[8]; // 食指指尖
        let thumb = landmarks[4];  // 拇指指尖

        if (finger && thumb) {
            let pinch = dist(finger[0], finger[1], thumb[0], thumb[1]);
            console.log("Pinch Distance:", pinch);
            let speed = map(pinch, 100, 700, 0.1, 2);
            lettuceVideo.speed(speed);
        }
    } else {
        lettuceVideo.speed(1);
    }

    // 限制手势检测频率
    frameCounter++;
    if (frameCounter % detectionInterval === 0) {
        handPose.detectStart(video, gotHands);
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

// 防止 iPad 进入省电模式
async function requestWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log("Wake Lock activated");
            wakeLock.addEventListener('release', () => {
                console.log("Wake Lock released");
            });
        } catch (err) {
            console.error(`Wake Lock error: ${err.name}, ${err.message}`);
        }
    }
}

// 监听页面可见性变化
function handleVisibilityChange() {
    if (document.visibilityState === 'visible' && wakeLock === null) {
        requestWakeLock();
    }
}

function touchStarted() {
    if (lettuceVideo && lettuceVideo.elt.paused) {
        lettuceVideo.loop();
        lettuceVideo.volume(1);
        requestWakeLock();
    }
    return false; // 防止页面滚动
}