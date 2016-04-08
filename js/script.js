var canvas = document.getElementById("canvas");

var w = canvas.clientWidth;
var h = canvas.clientHeight;

// var xMouse = 0;
// var yMouse = 0;

var blockWidth =100;
var blockHeight = Math.round(blockWidth / 2.5);
var centerLine = Math.round(h / 2 );

var getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var points= [];
var current = [];

var pointProto = {
	constructor:function(x, y){
		this.x = x;
		this.y = y;
		this.angle = 0;
		return this
	}
}
var blocks = [];

blockProto = {
	constructor:function(a,b,c,d){
		this.points = [a,b,c,d];
		return this
	}
}

var pointsCreate = function(){
	for (var i = 0; i <= w; i = i + blockWidth) {
		points.push(Object.create(pointProto).constructor(i, blockHeight/2));
		current.push(Object.create(pointProto).constructor(i, blockHeight/2));
	}
}

var pointsMove = function() {
	var cpId = Math.round(points.length / 2)
	var cp = points[cpId];
	var rotation = true;
	cp.y = getRandomInt(centerLine-blockWidth/2, centerLine+blockWidth/2);
	var angle = anglePoints(points[cpId-1], cp);

	var newPointPosition = function(i) {

		var alfa = getRandomInt(90, 90);
		var bwr = getRandomInt(blockWidth*1.75, blockWidth*1.75);

		if (angle < -45) {rotation = true;}
		if (angle > 45) {rotation = false;}

		if (i > cpId) {

			if(rotation == true) {angle = angle + (180 - alfa);}
			if(rotation == false) {angle = angle - (180 - alfa);}

			points[i].x = points[i-1].x + Math.cos((angle/180)*Math.PI)*bwr;
			points[i].y = points[i-1].y + Math.sin((angle/180)*Math.PI)*bwr;
		}

		if (i <= cpId) {

			if(rotation == true) {angle = angle - (alfa - 180);}
			if(rotation == false) {angle = angle + (alfa - 180);}

			points[i-1].x = points[i].x - Math.cos((angle/180)*Math.PI)*bwr;
			points[i-1].y = points[i].y - Math.sin((angle/180)*Math.PI)*bwr;
		}

		points[i].angle = angle;
	}

	for (var i = cpId; i < points.length; i++) {newPointPosition(i);}

	angle = anglePoints(points[cpId-1], points[cpId]);

	for (var i = cpId-1; i > 0; i--) {newPointPosition(i);}
		
	// DrowLine();
}

var DrowLine = function() {

	var blockDraw = function(obj) {
		if(blocks.indexOf(obj) & 1) {ctx.fillStyle = "rgba(255, 255, 255, 1";}
		else {ctx.fillStyle = "rgba(200, 200, 200, 1";}
		ctx.strokeStyle = "transparent";
		ctx.lineWidth = 1;
		ctx.beginPath();

		obj.points.forEach(function(item, i, arr) {
			ctx.lineTo(item.x, item.y);
		});

		ctx.fill();
		ctx.closePath();
	}

	ctx.clearRect(0, 0, w, h);
	blocks = [];
	for (var i = 1; i < points.length; i=i+2) {
		blockCreate(i);
		blockDraw(blocks[i-1]);
	}
	for (var i = 2; i < points.length; i=i+2) {
		blockCreateLight(i);
		blockDraw(blocks[i-1]);
	}
}

var lineAngle = function(p1, p2, k1, k2) {
	return  Math.abs(Math.atan(((k1 * (-1)) - (k2 * (-1))) / ((k1 * k2) + ((-1) * (-1))))*(180/Math.PI));
}

var intersection = function(p1, p2, k1, k2) {

	var x = (((p1.x*k1-p1.y)*(-1) - (p2.x*k2-p2.y)*(-1))/(k1*(-1) - k2*(-1)));
	var y = ((k1*(p2.x*k2-p2.y) - (p1.x*k1-p1.y)*k2)/(k1*(-1) - k2*(-1)));

	return {x:x, y:y};
}

var blockPointPosition = function(point, angle){

	var x = point.x + (blockHeight/2) * Math.cos(angle*Math.PI/180);
	var y = point.y + (blockHeight/2) * Math.sin(angle*Math.PI/180);

	return {x:x, y:y};
}

var blockCreateLight = function(i) {
	var a = current[i];
	var b = current[i-1];
	var c = current[i+1];
	var k1 = Math.tan(a.angle*Math.PI/180);
	var k2 = Math.tan(b.angle*Math.PI/180);
	var A, B, C, D;

	var kz = lineAngle(a, b, k1, k2);
	var kq;

	console.log("KZ = "+kz);

	if (c) {
		k3 = Math.tan(c.angle*Math.PI/180);
		kq = lineAngle(a, c, k1, k3);
		console.log("kq = "+kq);
		if(kq < 45) {
			q = -1; 
		}
	}


	if(i == 1) {
		A = blockPointPosition(b, a.angle-90);
		D = blockPointPosition(b, a.angle+90);;
	}
	else {

		if(kz < 45) {
			A = blocks[i-2].points[1];
			D = blocks[i-2].points[2];
		}
			
		else {
			A = blocks[i-2].points[2];
			D = blocks[i-2].points[1];
		}
	}

	if(i == current.length-1) {
		B = blockPointPosition(a, a.angle-90);;
		C = blockPointPosition(a, a.angle+90);;
	}
	else {
		if(kq < 45) {
			B = blocks[i].points[0];
			C = blocks[i].points[3];
		}

		else {
			B = blocks[i].points[3];
			C = blocks[i].points[0];
		}
	}


	blocks[i-1] = Object.create(blockProto).constructor(A, B, C, D);

};
var blockCreate = function(i) {
	var a = current[i];
	var b = current[i-1];
	var c = current[i+1];
	var A, B, C, D;
	var k1 = Math.tan(a.angle*Math.PI/180);
	var k2 = Math.tan(b.angle*Math.PI/180);
	var k3;
	var z = 1;
	var q = 1;
	var kz = lineAngle(a, b, k1, k2);
	var kq;

	console.log("kz = "+kz);

	if(kz < 45) { z = -1; }

	if (c) {
		k3 = Math.tan(c.angle*Math.PI/180);
		kq = lineAngle(a, c, k1, k3);
		console.log("kq = "+kq);
		if(kq < 45) {
			q = -1; 
		}
	}

	if ((kz == 0) || (i == 1)) {
		A = blockPointPosition(b, a.angle-90);
		D = blockPointPosition(b, a.angle+90);
	}

	else {
		A = intersection(
			blockPointPosition(a, a.angle-90*z), 
			blockPointPosition(b, b.angle+90*z), 
			k1, 
			k2
		);
		D = intersection(
			blockPointPosition(a, a.angle+90*z), 
			blockPointPosition(b, b.angle-90*z), 
			k1, 
			k2
		);
	}

	if((i == current.length-1) || (kq == 0)) {
		B = blockPointPosition(a, a.angle-90);
		C = blockPointPosition(a, a.angle+90);
	}

	else {
		B = intersection(
			A, 
			blockPointPosition(c, c.angle+90*q), 
			k1,
			k3
		);
		C = intersection(
			D, 
			blockPointPosition(c, c.angle-90*q), 
			k1, 
			k3
		);
	}

	blocks[i-1] = Object.create(blockProto).constructor(A, B, C, D);
};


function anglePoints(p1, p2) {
	var a =  (Math.atan((p2.y - p1.y) / (p2.x - p1.x)));
	if( (p2.x - p1.x) < 0 ) { a = Math.PI + a;}
	if( ((p2.x - p1.x) < 0) && ((p2.y - p1.y) < 0) ) {a = -(2* Math.PI - a);}
	return a*180/Math.PI;
}

var lineMove = function() {

	var shag = 50;
	var j = 0;
	
	var kadr = setInterval(function(){
		clearInterval(kadr-1);
		for (var i = current.length - 1; i >= 0; i--) {
			current[i].x = current[i].x + (points[i].x - current[i].x) / (shag -j);
			current[i].y = current[i].y + (points[i].y - current[i].y) / (shag -j);
			current[i].angle = current[i].angle + (points[i].angle - current[i].angle) / (shag -j);
		}
		console.log(j);
		j++;
		DrowLine();

		if (j == shag) {
			clearInterval(kadr);
		}
	}, 300);
}

var init = function() {
	ctx = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
}

pointsCreate();
init();
DrowLine();

document.onclick = function(e){
	pointsMove();
	lineMove()
};
