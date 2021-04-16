let canvas;
let ctx;

let wallX;
let wallY;


let t = 0;
let balls =[];
let queue = new PriorityQueue((a, b) => a[0] < b[0]);
let n = 10;
const HZ = 60;
const T = 1000;

const predictX = (a) => {
    if(a===null) return;
    const th = a.timeToHitHWall();
    if(t+th<T) queue.push([t+th,a,null]);
}

const predictY = (a) => {
    if(a===null) return;
    const tv = a.timeToHitVWall();
    if(t+tv<T) queue.push([t+tv,null,a]);
}

const redraw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((ball)=>{
        ball.draw();
    });
    queue.push([t+1/HZ,null,null]);
}

const simulate = async () => {
    balls.forEach((ball)=>{
        predictX(ball);
        predictY(ball);
    });
    queue.push([0,null,null]);
    while(!queue.isEmpty()){
        const topEvent = queue.pop();
        const timeToHit = topEvent[0];
        const ball1 = topEvent[1];
        const ball2 = topEvent[2];
        const deltaT = timeToHit - t;
        balls.forEach((ball)=>{
            ball.move(deltaT);
        });
        await new Promise((resolve)=>setTimeout(resolve,deltaT));
        if(ball1===null&&ball2===null) redraw();
        if(ball1!=null&&ball2===null) {ball1.bounceOffHWall(); predictX(ball1);}
        if(ball2!=null&&ball1===null) {ball2.bounceOffVWall(); predictY(ball2);}
        t = timeToHit;
    }
}

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    resizeCanvas();
    for(let i=0;i<n;i+=1){
        balls.push(new Ball());
    }
    canvas.style.display = 'block';
    simulate();
}

window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        wallX = window.innerWidth;
        wallY = window.innerHeight;
        canvas.height = wallY;
        canvas.width = wallX;
        while(!queue.isEmpty()){
            queue.pop();
        }
        balls.forEach((ball)=>{
            predictX(ball);
            predictY(ball);
        });
    }