let canvas;
let ctx;

let wallX;
let wallY;

class Ball{
    constructor(){
        this.rx = this.getRandom(0,wallX);
        this.ry = this.getRandom(0,wallY);
        let theta = this.getRandom(0,2*Math.PI);
        this.vx = 500*Math.cos(theta);
        this.vy = 500*Math.sin(theta);
        this.r = 10;
    }

    getRandom(min,max){
        return min + Math.random()*(max-min);
    }

    move(deltaT){
        const newX = this.rx + this.vx*deltaT;
        const newY = this.ry + this.vy*deltaT;
        if(newX<this.r||newX>wallX-this.r){ this.vx = -this.vx; }
        if(newY<this.r||newY>wallY-this.r){ this.vy = -this.vy; }
        this.rx = newX;
        this.ry = newY;
    }

    draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(this.rx,this.ry,this.r,0,2*Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.stroke();
    }

}
let curr;
let ball;
const simulate = (timestamp) => {
    if(curr==undefined) curr = timestamp;
    const deltaT = (timestamp - curr)/1000;
    curr = timestamp;
    ball.move(deltaT);
    ball.draw();
    window.requestAnimationFrame(simulate);
}

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    resizeCanvas();
    ball = new Ball();
    canvas.style.display = 'block';
    window.requestAnimationFrame(simulate);
}

window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        wallX = window.innerWidth;
        wallY = window.innerHeight;
        canvas.height = wallY;
        canvas.width = wallX;
    }