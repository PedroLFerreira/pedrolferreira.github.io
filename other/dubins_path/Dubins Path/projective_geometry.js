/*
|a b e|
|c d f|
|0 0 1|

point: 
|x|
|y|
|1|
vector:
|x|
|y|
|0|

*/

function translation(x,y){
    return {a: 1, b: 0, c:1, d:0, e: x, d: y}
}

function rotation(angle){
    return {a: Math.cos(angle), b: -Math.sin(angle), c:Math.sin(angle), d:Math.cos(angle), e:0.0,d:0.0}
}

function compose(m1,m2){
    return {
    a: m1.a*m2.a + m1.b*m2.c,
    b: m1.a*m2.b + m1.b*m2.d,
    c: m1.c*m2.a + m1.d*m2.c,
    d: m1.c*m2.b + m1.d*m2.d,
    e: m1.a*m2.e + m1.b*m2.f + m1.e,
    f: m1.c*m2.e + m1.d*m2.f + m1.f,
    }
}

function applyVector(m,v){

    return {x: m.a*v.x+m.b*v.y, y: m.c*v.x+m.d*v.y};
}


function applyPoint(m, v){
    return {x: m.a*v.x+m.b*v.y + m.e, y: m.c*v.x+m.d*v.y + m.f};
}
function rotationAroundPoint(p,angle) {
  return compose(translation(p.x,p.y), compose(rotation(angle), translation(-p.x,-p.y)));
}



function dot(u,v){
    return u.x*v.x + u.y*v.y;
}

function norm(v){
    return Math.sqrt(v.x*v.x + v.y*v.y);
}

function angle_between(u,v){
    let angle = Math.atan2(u.y, u.x) - Math.atan2(v.y, v.x);
    if (angle < 0) { angle += 2 * Math.PI; }
    return angle;
    // return Math.acos(dot(u,v)/(norm(u)*norm(v)));
}