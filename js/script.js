var canvas = document.getElementById("canvas");

var w = canvas.clientWidth;
var h = canvas.clientHeight;

var blockWidth =100;
var blockHeight = Math.round(blockWidth / 2.5);
var lineColor = "#ffffff";
var angleMin = 75;
var angleMax = 125;

var rgbColor = function(hex) {
	return [parseInt(hex.substring(1,3),16), parseInt(hex.substring(3,5),16), parseInt(hex.substring(5,7),16)];
}
var rgb = rgbColor(lineColor);
var color2 = "rgba("+(rgb[0])+", "+(rgb[1])+", "+(rgb[2])+", 1)";

rgbColor(lineColor);


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
		this.width = blockWidth;
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

		var alfa = getRandomInt(angleMin, angleMax);
		// var bwr = getRandomInt(blockWidth*0.75, blockWidth*1.75);

		points[i].width = getRandomInt(blockWidth*0.75, blockWidth*1.75);

		if (angle < -45) {rotation = true;}
		if (angle > 45) {rotation = false;}

		if (i > cpId) {

			if(rotation == true) {angle = angle + (180 - alfa);}
			if(rotation == false) {angle = angle - (180 - alfa);}

			points[i].x = points[i-1].x + Math.cos((angle/180)*Math.PI)*points[i].width;
			points[i].y = points[i-1].y + Math.sin((angle/180)*Math.PI)*points[i].width;
		}

		if (i <= cpId) {

			if(rotation == true) {angle = angle - (alfa - 180);}
			if(rotation == false) {angle = angle + (alfa - 180);}

			points[i-1].x = points[i].x - Math.cos((angle/180)*Math.PI)*points[i].width;
			points[i-1].y = points[i].y - Math.sin((angle/180)*Math.PI)*points[i].width;
		}

		points[i].angle = angle;
	}

	for (var i = cpId; i < points.length; i++) {newPointPosition(i);}
	angle = anglePoints(points[cpId-1], points[cpId]);
	for (var i = cpId-1; i > 0; i--) {newPointPosition(i);}

}

var DrowLine = function() {

	var blockDraw = function(obj) {

		var rgb = rgbColor(lineColor);
		if(blocks.indexOf(obj) & 1) {ctx.fillStyle = "rgba("+rgb[0]+", "+rgb[1]+", "+rgb[2]+", 1)";}
		else {ctx.fillStyle = color2;}
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
		blockCreate(i);
		blockDraw(blocks[i-1]);
	}

	// help circle draw

	current.forEach(function(item, i, arr){
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.arc(item.x, item.y, 5, 0, 2*Math.PI, true);
		ctx.strokeStyle = "red";
		ctx.stroke();
		ctx.closePath();
	});

	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#03BE3C";
	current.forEach(function(item, i, arr){
		ctx.lineTo(item.x, item.y);
	});
	ctx.stroke();
	ctx.closePath();
}

var lineAngle = function(p1, p2) {
	return 180 - Math.abs(p1.angle - p2.angle);
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
	var kz = lineAngle(a, b);
	var kq;

	if(kz > angleMax) {z = -1;}

	if (c) {
		k3 = Math.tan(c.angle*Math.PI/180);
		kq = lineAngle(a, c);
		if(kq > angleMax) {q = -1;}
	}

	if (i & 1) {

		if ((kz == 180) || (i == 1)) {
			A = blockPointPosition(b, a.angle-90);
			D = blockPointPosition(b, a.angle+90);
		}

		else {
			A = intersection(
				blockPointPosition(a, a.angle-90), 
				blockPointPosition(b, b.angle+90*z), 
				k1, 
				k2
			);
			D = intersection(
				blockPointPosition(a, a.angle+90), 
				blockPointPosition(b, b.angle-90*z), 
				k1, 
				k2
			);
		}

		if((i == current.length-1) || (kq == 180)) {
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
	}
	else {

		if(kz > angleMax) {
			A = blocks[i-2].points[1];
			D = blocks[i-2].points[2];
		}
			
		else {
			A = blocks[i-2].points[2];
			D = blocks[i-2].points[1];
		}

		if(i == current.length-1) {
			B = blockPointPosition(a, a.angle-90);
			C = blockPointPosition(a, a.angle+90);
		}
		else {
			if(kq > angleMax) {
				B = blocks[i].points[0];
				C = blocks[i].points[3];
			}

			else {
				B = blocks[i].points[3];
				C = blocks[i].points[0];
			}
		}
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
	pointsMove();
	var shag = 50;
	var j = 0;

	var cpId = Math.round(points.length / 2)

	var kadr = setInterval(function(){
		clearInterval(kadr-1);

		for (var i = current.length - 1; i >= 0; i--) {
			current[i].angle = current[i].angle + (points[i].angle - current[i].angle) / (shag -j);
			current[i].width = current[i].width + (points[i].width - current[i].width) / (shag -j);
			current[i].x = current[i].x + (points[i].x - current[i].x) / (shag -j);
			current[i].y = current[i].y + (points[i].y - current[i].y) / (shag -j);
		}

		color2 = "rgba("+(rgb[0]-(50/(shag-j)))+", "+(rgb[1]-(50/(shag-j)))+", "+(rgb[2]-(50/(shag-j)))+", 1)";

		console.log("shag = "+j);
		j++;
		DrowLine();

		if (j == shag) {
			clearInterval(kadr);
		}
	}, 100);
	stage = 2;
}

var lineStop = function() {
	setInterval(function(){
		for (var i = current.length - 1; i >= 0; i--) {
			current[i].angle++;
			DrowLine();
		}
		
	}, 10);
}

var lineAction = (function() {
	var shag = 20;
	var cpId = Math.round(points.length / 2);
	var j = 0;
	// pointsMove();

	return function(){

		for (var i = current.length - 1; i >= 0; i--) {
			current[i].angle = current[i].angle + (points[i].angle - current[i].angle) / (shag -j);
			current[i].width = current[i].width + (points[i].width - current[i].width) / (shag -j);
			current[i].x = current[i].x + (points[i].x - current[i].x) / (shag -j);
			current[i].y = current[i].y + (points[i].y - current[i].y) / (shag -j);
		}
		
		// color2 = "rgba("+(rgb[0]-(50/(shag-j)))+", "+(rgb[1]-(50/(shag-j)))+", "+(rgb[2]-(50/(shag-j)))+", 1)";

		console.log("shag = "+j);
		console.log("action = "+j);
		console.log(current);
		j++;
		DrowLine();
	}
	stage = 2;
}());

var init = function() {
	ctx = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
}

pointsCreate();
init();
DrowLine();

var stage = 0;

document.onclick = function(e){
	if (stage == 2) {
		// pointsMove();
		console.log("pointsMove");
		pointsMove();
		stage = 1;
	}
	if (stage == 1) {
		// lineStop();
		lineAction();
	}
	if (stage == 0) {
		lineMove();
	}
};

