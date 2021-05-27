class CEvent{
    constructor(t,ball1,ball2){
        this.t = t;
        this.ball1 = ball1;
        this.ball2 = ball2;
        this.count1 = ball1? ball1.count : null;
        this.count2 = ball2? ball2.count : null;
    }

    isValid(){
        if(this.ball1!=null&&this.ball1.count!=this.count1) return false;
        if(this.ball2!=null&&this.ball2.count!=this.count2) return false;
        return true;
    }
}