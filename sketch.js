let handPose;
let video;
let hands = [];
let lettuceVideo;
let isPermissionGranted = false;

function preload() {
    handPose = ml5.handpose();
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // 全屏启动按钮
    const fullscreenBtn = createButton('▶ 全屏启动');
    fullscreenBtn.position(20, 20);
    fullscreenBtn.style('padding', '15px 25px');
    fullscreenBtn.style('font-size', '18px');
    fullscreenBtn.style('border-radius', '8px');
    fullscreenBtn.mousePressed(() => {
        requestFullscreen();
        fullscreenBtn.remove();
        createPermissionButton();
    });
}

function createPermissionButton() {
    // 权限请求按钮
    const permBtn = createButton('👆 启用手势控制');
    permBtn.position(20, 20);
    permBtn.style('background', '#4CAF50');
    permBtn.style('color', 'white');
    permBtn.style('padding', '12px 20px');
    permBtn.style('border', 'none');
    permBtn.style('border-radius', '6px');
    permBtn.mousePressed(async () => {
        try {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                const status = await DeviceOrientationEvent.requestPermission();
                if (status === 'granted') {
                    isPermissionGranted = true;
                    initializeCamera();
                    createVideoButton();
                    permBtn.remove();
                }
            } else {
                isPermissionGranted = true;
                initializeCamera();
                createVideoButton();
                permBtn.remove();
            }
        } catch (error) {
            console.error('权限请求失败:', error);
        }
    });
}

function initializeCamera() {
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();
    handPose.detectStart(video, gotHands);
}

function createVideoButton() {
    // 视频播放按钮
    const videoBtn = createButton('🎬 开始播放');
    videoBtn.position(20, 60);
    videoBtn.style('background', '#2196F3');
    videoBtn.style('color', 'white');
    videoBtn.style('padding', '12px 20px');
    videoBtn.style('border-radius', '6px');
    videoBtn.mousePressed(() => {
        lettuceVideo = createVideo(['assets/Lettuce.mp4'], () => {
            lettuceVideo.size(width, height);
            lettuceVideo.hide();
            lettuceVideo.volume(0);
            lettuceVideo.loop();
            setTimeout(() => lettuceVideo.volume(1), 1000); // 延迟解除静音
        });
        videoBtn.remove();
    });
}

function draw() {
    background(0);
    if (lettuceVideo) {
        image(lettuceVideo, 0, 0, width, height);
    }

    if (hands.length > 0 && isPermissionGranted) {
        const indexFinger = hands[0].annotations.indexFinger[3];
        const thumb = hands[0].annotations.thumb[3];

        const pinchDist = dist(
            indexFinger[0], indexFinger[1],
            thumb[0], thumb[1]
        );

        const speed = map(pinchDist, 0, 150, 0.5, 2, true);
        lettuceVideo.speed(constrain(speed, 0.5, 2));

        // 调试显示
        fill(255);
        textSize(20);
        text(`播放速度: ${speed.toFixed(1)}x`, 20, height - 40);
    }
}

function gotHands(results) {
    hands = results;
}

function requestFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

function touchStarted() {
    if (lettuceVideo && lettuceVideo.elt.paused) {
        lettuceVideo.loop();
    }
    return false;
}
