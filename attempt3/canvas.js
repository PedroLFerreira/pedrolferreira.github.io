const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = 200 +40;
canvas.style.zIndex = -100;



n_dots = 500;
c.fillStyle = "rgb(100,100,100)";
console.log(canvas.width,canvas.height);

class Dot {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    update() {
        this.dx += (Math.random()-0.5)*1;
        this.dy += (Math.random()-0.5)*1;
        this.dx = Math.max(Math.min(this.dx,1),-1)
        this.dy = Math.max(Math.min(this.dy,1),-1)
        this.x += this.dx;
        this.y += this.dy;

        if(this.x < 0){
            this.x += canvas.width;
        }
        else if(this.x > canvas.width){
            this.x -= canvas.width;
        }
        if(this.y < 0){
            this.y += canvas.height;
        }
        else if(this.y > canvas.height){
            this.y -= canvas.height;
        }
    }
}




var dots = [];
function init() {
    for (let i = 0; i < n_dots; i++) {
        var x = Math.random()*canvas.width;
        var y = Math.random()*canvas.height;
        var dx = Math.random()*2 - 1
        var dy = Math.random()*2 - 1
        dots.push(new Dot(x,y,dx,dy));
    }
}



function animate(){
    if(canvas.width!=window.innerWidth){
        canvas.width = window.innerWidth;
    }

    c.clearRect(0,0,canvas.width,canvas.height);

    for (let i = 0; i < dots.length; i++) {
        dots[i].update();
        c.fillRect(dots[i].x,dots[i].y,2,2);
    }

    window.requestAnimationFrame(animate);
}

init();
animate();