class Ball{
    constructor(){
        this.rx = this.getRandom(0,wallX);
        this.ry = this.getRandom(0,wallY);
        let theta = this.getRandom(0,2*Math.PI);
        this.vx = 100*Math.cos(theta);
        this.vy = 100*Math.sin(theta);
        this.r = 10;
        this.count = 0;
        this.color = `rgb(${this.getRandom(0,200)},${this.getRandom(0,200)},${this.getRandom(0,200)})`;
    }

    getRandom(min,max){
        return min + Math.random()*(max-min);
    }

    move(deltaT){
        const newX = this.rx + this.vx*deltaT;
        const newY = this.ry + this.vy*deltaT;
        this.rx = newX;
        this.ry = newY;
    }

    timeToHitVWall(){
        if(this.vy>0) return (wallY - (this.ry+this.r))/this.vy;
        if(this.vy<0) return -(this.ry-this.r)/this.vy;
        return Infinity;
    }

    timeToHitHWall(){
        if(this.vx>0) return (wallX - (this.rx+this.r))/this.vx;
        if(this.vx<0) return -(this.rx-this.r)/this.vx;
        return Infinity;
    }

    bounceOffVWall(){
        this.vy = -this.vy;
        this.count++;
    }

    bounceOffHWall(){
        this.vx = -this.vx;
        this.count++;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.rx,this.ry,this.r,0,2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }

}