class Ball{
    constructor(){
        this.rx = this.getRandom(0,wallX);
        this.ry = this.getRandom(0,wallY);
        let theta = this.getRandom(0,2*Math.PI);
        this.vx = 300*Math.cos(theta);
        this.vy = 300*Math.sin(theta);
        this.r = 20;
        this.mass = 0.2;
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

    timeToHitOtherBall(ball){
        if(!ball) return;
        if (this == ball) return Number.POSITIVE_INFINITY;
        const vxRel = ball.vx - this.vx;
        const vyRel = ball.vy - this.vy;
        const xRel = ball.rx - this.rx;
        const yRel = ball.ry - this.ry;
        const dvdr = xRel*vxRel + yRel*vyRel; 
        if (dvdr > 0) return Number.POSITIVE_INFINITY;
        const dvdv = vxRel*vxRel + vyRel*vyRel;
        if (dvdv == 0) return Number.POSITIVE_INFINITY;
        const drdr = xRel*xRel + yRel*yRel;
        const sigma = this.r + ball.r;
        const d = (dvdr*dvdr) - dvdv * (drdr - sigma*sigma);
        // if (drdr < sigma*sigma) StdOut.println("overlapping particles");
        if (d < 0) return Number.POSITIVE_INFINITY;
        return -(dvdr + Math.sqrt(d)) / dvdv;
    }

    bounceOffOther(ball){
        if(!ball) return;
        const vxRel = ball.vx - this.vx;
        const vyRel = ball.vy - this.vy;
        const xRel = ball.rx - this.rx;
        const yRel = ball.ry - this.ry;
        const dvdr = xRel*vxRel + yRel*vyRel;   
        console.log(xRel*xRel+yRel*yRel);     // dv dot dr
        const dist = 40;   // distance between particle centers at collison

        // magnitude of normal force
        const magnitude = dvdr /  dist;

        // normal force, and in x and y directions
        const fx = magnitude * xRel / dist;
        const fy = magnitude * yRel / dist;

        // update velocities according to normal force
        this.vx += fx;
        this.vy += fy;
        ball.vx -= fx;
        ball.vy -= fy;
        this.count++;
        ball.count++;
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