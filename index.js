import Ball from './ball.mjs';
import CEvent from './event.mjs';
import PriorityQueue from './priorityQueue.mjs';

let canvas;
let ctx;

let wallX;
let wallY;


let t = 0;
let balls = [];
let queue = new PriorityQueue((a, b) => a.t < b.t);
let n = 15;
const HZ = 60;
const T = 1000;

const predictX = (a) => {
    if (a === null) return;
    const th = a.timeToHitHWall(wallX);
    if (t + th < T) queue.push(new CEvent(t + th, a, null));
}

const predictY = (a) => {
    if (a === null) return;
    const tv = a.timeToHitVWall(wallY);
    if (t + tv < T) queue.push(new CEvent(t + tv, null, a));
}

const redraw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((ball) => {
        ball.draw(ctx);
    });
    queue.push(new CEvent(t + 1 / HZ, null, null));
}

const predictAll = () => {
    balls.forEach((ball) => {
        predictX(ball);
        predictY(ball);
    });

    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const th = balls[i].timeToHitOtherBall(balls[j]);
            if (t + th < T) queue.push(new CEvent(t + th, balls[i], balls[j]));
        }
    }
    queue.push(new CEvent(0, null, null));
}

const predictBall = (ballToHit) => {
    balls.forEach((ball) => {
        if (ballToHit != ball) {
            const th = ballToHit.timeToHitOtherBall(ball);
            if (t + th < T) queue.push(new CEvent(t + th, ballToHit, ball));
        }
    });
    predictX(ballToHit);
    predictY(ballToHit);
}

const simulate = async () => {
    while (!queue.isEmpty()) {
        const topEvent = queue.pop();
        if (!topEvent.isValid()) continue;
        const timeToHit = topEvent.t;
        const ball1 = topEvent.ball1;
        const ball2 = topEvent.ball2;
        const deltaT = timeToHit - t;
        balls.forEach((ball) => {
            ball.move(deltaT);
        });
        await new Promise((resolve) => setTimeout(resolve, deltaT));
        if (ball1 === null && ball2 === null) redraw();
        if (ball1 != null && ball2 === null) { ball1.bounceOffHWall(); predictX(ball1); }
        if (ball2 != null && ball1 === null) { ball2.bounceOffVWall(); predictY(ball2); }
        if (ball2 != null && ball1 != null) {
            ball1.bounceOffOther(ball2);
        }
        ball1 && predictBall(ball1);
        ball2 && predictBall(ball2);
        t = timeToHit;
    }
}

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    resizeCanvas();
    for (let i = 0; i < n; i += 1) {
        balls.push(new Ball(wallX, wallY));
    }
    canvas.style.display = 'block';
    predictAll();
    simulate();
}

window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
    wallX = window.innerWidth;
    wallY = window.innerHeight;
    canvas.height = wallY;
    canvas.width = wallX;
    while (!queue.isEmpty()) {
        queue.pop();
    }
    predictAll();
}