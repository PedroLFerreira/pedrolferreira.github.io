
var c = $("#canvas");
var ctx = c[0].getContext("2d");
var width = $(window).width();
var height = $(window).height();

var originPoint = [width/2,height/2];
var originPoint2 = [width/2,height/2+5];

var growthStep = 2;
var growthNoise = 1;
var R = 10;
var N_branch = 10;
var P_branch = 0.4;
var neighbour_dir_influence = 1;
var MAX_NODES = 10000;

class Node {
    constructor(id,parent_id,position,isTip=true){
        this.id = id;
        this.parent_id = parent_id;
        this.position = position;
        this.isTip = isTip;
        this.isActive = true;
    }
}

function drawLine(from, to) {
    ctx.beginPath();
    ctx.moveTo(from[0],from[1]);
    ctx.lineTo(to[0],to[1]);
    ctx.stroke();
}

function drawNetwork(){
    ctx.clearRect(0, 0, width, height);

    nodeList.forEach((node) => {
        if(node.parent_id != null){
            drawLine(node.position,nodeList[node.parent_id].position);
        }
    })
}

function drawNewNodes(newNodes){
    // console.log(newNodes);
    newNodes.forEach((node) => {
        if(node.parent_id != null){
            drawLine(node.position,nodeList[node.parent_id].position);
        }
    })
}

function getNeighbours(node){
    var neighbours = [];
    nodeList.filter(other_node =>{return other_node.id != node.id;}).forEach(other_node => {
        var dx = node.position[0] - other_node.position[0];
        var dy = node.position[1] - other_node.position[1];
        var sqrDistance = dx*dx + dy*dy;
        if (sqrDistance < R*R) {
            neighbours.push(other_node);
        }
    });
    return neighbours;
}

function getAverageNeighbourDirection(neighbours){
    var field_x = 0, field_y = 0;

    neighbours.forEach((neighbour) => {
        if(neighbour.parent_id != null){
            var parent = nodeList[neighbour.parent_id]
            field_x += neighbour.position[0] - parent.position[0];
            field_y += neighbour.position[1] - parent.position[1];
        }
    });
    var field_strength = Math.sqrt(field_x*field_x + field_y*field_y)/neighbour_dir_influence;
    field_x /= field_strength, field_y /= field_strength;
    return [field_x, field_y];
}

var nodeList = [new Node(0,1,originPoint), new Node(1,0,originPoint2)];
var tipNodeList = nodeList.filter((node) => {return node.isTip == true;})


function iterate() {
    var newNodes = [];
    // console.log(nodeList);
    nodeList.forEach((node) => {

        if(!node.isActive){
            return;
        }

        var x = node.position[0], y = node.position[1];

        // Find neighbouring segments of mycelium (N) which are at distance less than R
        var neighbours = getNeighbours(node);
        if(neighbours.length > N_branch){
            node.isActive = false;
        }

        // Grow if tip
        if(node.isTip){
            var parent_pos = nodeList[node.parent_id].position;
            var parent_x = parent_pos[0], parent_y = parent_pos[1];

            var growVector = [x-parent_x,y-parent_y];
            // var growVector = [0,0];

            var theta = 2*Math.PI*Math.random();
            var rand_2d = [Math.cos(theta)*growthNoise,Math.sin(theta)*growthNoise];


            var field = getAverageNeighbourDirection(neighbours);
            
            var dx = growVector[0]+rand_2d[0]+field[0];
            var dy = growVector[1]+rand_2d[1]+field[1];

            var mag = Math.sqrt(dx*dx+dy*dy)/growthStep

            var newPos = [x+dx/mag,y+dy/mag];
            
            var newNode = new Node(nodeList.length,node.id,newPos)
            nodeList.push(newNode);
            node.isTip = false;
            tipNodeList.pop(node);

            newNodes.push(newNode);
        }
        


        // if N < N_branch then with prob P_branch the tip will branch with random angle
        if (neighbours.length <= N_branch && Math.random() <= P_branch) {

            var theta = 2*Math.PI*Math.random();
            var rand_2d = [Math.cos(theta)*growthNoise,Math.sin(theta)*growthNoise];
            var dx = rand_2d[0], dy = rand_2d[1];

            var newPosition = [x+dx,y+dy];
            
            var newNode = new Node(nodeList.length,node.id,newPosition);
            nodeList.push(newNode)
            // node.isTip = false;
            tipNodeList.pop(node);

            newNodes.push(newNode);
        }

    })

    drawNewNodes(newNodes);
}

$(function(){
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    drawNetwork();
})

var interval = null;
$("#canvas").click(function (e) {
    if(interval == null){
        ctx.clearRect(0, 0, width, height);
        nodeList = [new Node(0,1,originPoint), new Node(1,0,originPoint2)];
        tipNodeList = nodeList.filter((node) => {return node.isTip == true;})
        drawNetwork();
        interval = setInterval(function(){
            iterate();
            $("#panel").html("Number of nodes: " + nodeList.length);
            // console.log("Number of nodes: ", nodeList.length);
            if(nodeList.length >= MAX_NODES){
                $("#panel").html("Number of nodes: " + nodeList.length + "   Simulation complete. Click below to simulate again...");
                clearInterval(interval);
                interval = null;
            }
        },50);
        // iterate();
    }
});

$("#max_nodes_slider").on("change",function(){
    $("#max_nodes").html($("#max_nodes_slider").val());
    MAX_NODES = $("#max_nodes_slider").val();
})

$("#growth_step_slider").on("change",function(){
    $("#growth_step").html($("#growth_step_slider").val());
    growthStep = $("#growth_step_slider").val();
})

$("#growth_noise_slider").on("change",function(){
    $("#growth_noise").html($("#growth_noise_slider").val());
    growthNoise = $("#growth_noise_slider").val();
})




$("#R_slider").on("change",function(){
    $("#R").html($("#R_slider").val());
    R = $("#R_slider").val();
})
$("#N_branch_slider").on("change",function(){
    $("#N_branch").html($("#N_branch_slider").val());
    N_branch = $("#N_branch_slider").val();
})
$("#P_branch_slider").on("change",function(){
    $("#P_branch").html($("#P_branch_slider").val());
    P_branch = $("#P_branch_slider").val();
})
$("#neighbour_dir_influence_slider").on("change",function(){
    $("#neighbour_dir_influence").html($("#neighbour_dir_influence_slider").val());
    neighbour_dir_influence = $("#neighbour_dir_influence_slider").val();
})