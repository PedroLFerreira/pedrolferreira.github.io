var canvas = document.getElementsByTagName("canvas")[0];
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var vertices = [];

function calculate(n_points, multiplier) {
    var vertices = [];
    vertices.push({x:canvas.width/2, y:canvas.height/2});
    vertices.push({x:canvas.width/2-20, y:canvas.height/2-20});
    vertices.push({x:canvas.width/2+20, y:canvas.height/2-20});
    for (let i = 3; i < n_points - 3; i++) {
        var mult = multiplier;
        var u = vertices[i-3].x + (vertices[i-3].x - vertices[i-1].x)*mult;
        var v = vertices[i-3].y + (vertices[i-3].y - vertices[i-1].y)*mult;
        vertices.push({x:u,y:v})
    }
    return vertices;
}

function draw(){
    
    [m,dir] = change_m(m,dir);
    var vertices = calculate(200,m);

    c.clearRect(0,0,canvas.width,canvas.height);
    c.beginPath();
    vertices.forEach(vertex => {
        c.lineTo(vertex.x,vertex.y);
    });
    c.stroke();
    
    window.requestAnimationFrame(draw);
}

function change_m(m,dir){
    if(m <= 0.01){
        dir = 0.002;
    }
    else if (m > 2){
        dir = -0.002;
    }

    m += dir;
    return [m,dir];
}

calculate(300,0.05);
var m = 0.05;
var dir = 0.002;
draw();
