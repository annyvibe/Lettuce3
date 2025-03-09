let handpose;
let video;
let hands = [];
let lettuceVideo;
let isFullscreen = false;

function setup() {
    createCanvas(windowWidth, windowHeight);

    // 添加权限策略兼容性
    if (!navigator.permissions) {
        console.log('浏览器不支持权限API');
    }

    // 初始化手势检测模型
    handpose = ml5.handpose({ maxHands: 1, flipHorizontal: true });

    // 创建交互式按钮
    createButtons();
}

function createButtons() {
    // 全屏按钮
    const fullscreenBtn = createButton('▶ 进入全屏');
    fullscreenBtn.position(20, 20);
    fullscreenBtn.style('padding', '15px 25px');
    fullscreenBtn.style('font-size', '18px');
    fullscreenBtn.mousePressed(async () => {
        await requestFullscreen();
        fullscreenBtn.remove();
        createPermissionButton();
    });
}

async function requestFullscreen() {
    return new Promise((resolve) => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().then(resolve);
        } else if (elem.webkitRequestFullscreen) { // Safari兼容
            elem.webkitRequestFullscreen().then(resolve);
        }
    });
}

function createPermissionButton() {
    // 权限请求按钮
    const permBtn = createButton('👆 启用手势控制');
    permBtn.position(20, 20);
    permBtn.style('background', '#4CAF50');
    permBtn.style('color', 'white');
    permBtn.mousePressed(async () => {
        try {
            // iOS特殊权限处理
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                const status = await DeviceOrientationEvent.requestPermission();
                if (status === 'granted') {
                    initializeCamera();
                    createVideoButton();
                    permBtn.remove();
                }
            } else {
                initializeCamera();
                createVideoButton();
                permBtn.remove();
            }
        } catch (error) {
            console.error('权限获取失败:', error);
        }
    });
}

function initializeCamera() {
    // 初始化摄像头
    video = createCapture(VIDEO);
    video.size(640, 480); // 降低分辨率提升性能
    video.hide();

    // 新版手势检测API
    handpose.detect(video);
    handpose.on('hand', (results) => {
        hands = results;
    });
}

function createVideoButton() {
    // 视频播放按钮
    const videoBtn = createButton('🎬 开始播放');
    videoBtn.position(20, 60);
    videoBtn.style('background', '#2196F3');
    videoBtn.style('color', 'white');
    videoBtn.mousePressed(() => {
        lettuceVideo = createVideo('assets/Lettuce.mp4', () => {
            lettuceVideo.size(width, height);
            lettuceVideo.hide();
            lettuceVideo.volume(0);
            lettuceVideo.loop();
            setTimeout(() => lettuceVideo.volume(1), 1000); // 渐进式取消静音
        });
        videoBtn.remove();
    });
}

function draw() {
    background(0);
    if (lettuceVideo) {
        image(lettuceVideo, 0, 0, width, height);
    }

    // 手势速度控制
    if (hands.length > 0 && lettuceVideo) {
        const hand = hands[0];
        const indexFinger = hand.annotations.indexFinger[3];
        const thumb = hand.annotations.thumb[3];

        const pinchDist = dist(
            indexFinger[0], indexFinger[1],
            thumb[0], thumb[1]
        );

        const speed = constrain(map(pinchDist, 0, 150, 0.5, 2), 0.5, 2);
        lettuceVideo.speed(speed);

        // 显示速度指示器
        fill(255);
        noStroke();
        textSize(24);
        text(`当前速度: ${speed.toFixed(1)}x`, 20, height - 40);
    }
}

function touchStarted() {
    if (lettuceVideo && lettuceVideo.elt.paused) {
        lettuceVideo.loop();
    }
    return false;
}
