var canvas = document.getElementById("canvas");

var w = canvas.clientWidth;
var h = canvas.clientHeight;

var xMouse = 0;
var yMouse = 0;

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
	for (var i = -w; i <= w*2; i = i + blockWidth) {
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

		var alfa = getRandomInt(70, 130);
		var bwr = getRandomInt(blockWidth*0.75, blockWidth*1.75)

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
	DrowLine();
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

var intersection = function(p1, p2, angle1, angle2) {

	var k1 = Math.tan(angle1*Math.PI/180);
	var k2 = Math.tan(angle2*Math.PI/180);
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
	var a = points[i];
	var b = points[i-1];
	var A, B, C, D;


	if(i == 1) {
		A = blockPointPosition(b, a.angle-90);
		D = blockPointPosition(b, a.angle+90);;
	}
	else {
		A = blocks[i-2].points[2];
		D = blocks[i-2].points[1];
	}

	if(i == points.length-1) {
		B = blockPointPosition(a, a.angle-90);;
		C = blockPointPosition(a, a.angle+90);;
	}
	else {
		B = blocks[i].points[3];
		C = blocks[i].points[0];
	}


	blocks[i-1] = Object.create(blockProto).constructor(A, B, C, D);

};
var blockCreate = function(i) {
	var a = points[i];
	var b = points[i-1];
	var c = points[i+1];
	var A, B, C, D;

	if ((a.angle == b.angle) || (i == 1)) {
		A = blockPointPosition(b, a.angle-90);
		D = blockPointPosition(b, a.angle+90);
	}

	else {
		A = intersection(
				blockPointPosition(a, a.angle-90), 
				blockPointPosition(b, b.angle+90), 
				points[i].angle, 
				b.angle
			);
		D = intersection(
				blockPointPosition(a, a.angle+90), 
				blockPointPosition(b, b.angle-90), 
				points[i].angle, 
				b.angle
			);
	}

	if((i == points.length-1) || (a.angle == c.angle)) {
		B = blockPointPosition(a, a.angle-90);
		C = blockPointPosition(a, a.angle+90);
	}

	else {
		B = intersection(
			A, 
			blockPointPosition(points[i+1], 
			c.angle+90), 
			points[i].angle, 
			c.angle
		);
		C = intersection(
			D, 
			blockPointPosition(c, 
			c.angle-90), 
			points[i].angle, 
			c.angle
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

var init = function() {
	ctx = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
}

pointsCreate();
init();
DrowLine();
// console.log(blocks);
document.onclick = function(e){
	pointsMove();
	console.log(current);
};