var canvas = document.getElementById("canvas");

var w = canvas.clientWidth;
var h = canvas.clientHeight;

var xMouse = 0;
var yMouse = 0;

var blockWidth =100;
var blockHeight = Math.round(blockWidth/5);


$("#canvas").mousemove(function(event) {
	xMouse = event.pageX - $(this).offset().left;
	yMouse = event.pageY - $(this).offset().top;




	var aRad = angleValue(points[Math.round(points.length / 2)]);

	ctx.clearRect(20, 30, 200, 20);

	ctx.fillStyle = "#fff";
	ctx.font = "normal 12px Arial";
	ctx.fillText(aRad*180/Math.PI, 20, 50);


});

var centerLine = Math.round(h / 2 );

var getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var testPoint_1 = {
	x: 100,
	y: 100,
	angle: 90
}
var testPoint_2 = {
	x: 200,
	y: 200,
	angle: 0
}


var points= [];

var pointProto = {
	constructor:function(x, y){
		this.x = x;
		this.y = y;
		return this
	}
}
var blocks= [];

blockProto = {
	constructor:function(a,b,c,d){
		this.points = [a,b,c,d];
		return this
	}
}

var pointsCreate = function(){
	for (var i = -w; i <= w*2; i = i + blockWidth) {
		points.push(Object.create(pointProto).constructor(i, centerLine));
	}
}

var pointsMove = function() {
	var cpId = Math.round(points.length / 2)
	var cp = points[cpId];
	var rotation = true;
	cp.y = getRandomInt(centerLine-blockWidth/2, centerLine+blockWidth/2);
	var angle = anglePoints(points[cpId-1], points[cpId]);

	var newPointPosition = function(i) {

		var alfa = getRandomInt(75, 125);
		var bwr = getRandomInt(blockWidth*0.75, blockWidth*1.5)
		if (angle < -45) {rotation = true;}
		if (angle > 45) {rotation = false;}

		if (i > cpId) {

			if(rotation == true) {angle = angle + (180 - alfa);}
			if(rotation == false) {angle = angle - (180 - alfa);}

			points[i].x = points[i-1].x + Math.cos((angle/180)*Math.PI)*bwr;
			points[i].y = points[i-1].y + Math.sin((angle/180)*Math.PI)*bwr;
		}

		if (i < cpId) {

			if(rotation == true) {angle = angle - (alfa - 180);}
			if(rotation == false) {angle = angle + (alfa - 180);}

			points[i-1].x = points[i].x - Math.cos((angle/180)*Math.PI)*bwr;
			points[i-1].y = points[i].y - Math.sin((angle/180)*Math.PI)*bwr;
		}

		points[i].angle = angle;
	}

	for (var i = cpId+1; i < points.length; i++) {newPointPosition(i);}
	angle = anglePoints(points[cpId-1], points[cpId]);
	for (var i = cpId; i > 0; i--) {newPointPosition(i);}
	pointsDraw();

	// blockCreate(testPoint_1, testPoint_2);
	blocks = [];
	for (var i = 1; i < points.length; i++) {
		blockCreate(i);
	}
	for (var i = 0; i < blocks.length; i++) {
		blockDraw(blocks[i]);
	}
	// console.log(cp);
}

var blockDraw = function(obj) {
	// console.log(obj);
	ctx.fillStyle = "rgba(255, 255, 255, 0.5";
	ctx.strokeStyle = "transparent";
	ctx.lineWidth = 1;
	ctx.beginPath();

	obj.points.forEach(function(item, i, arr) {
		// console.log(item);
		ctx.lineTo(item.x, item.y);
		ctx.fillRect(item.x-1, item.y-1, 3, 3);
	});

	ctx.fill();
	ctx.closePath();
}

var intersection = function(p1, p2, angle1, angle2) {
	console.log(p1);
	console.log(p2);
	var k1 = Math.tan(angle1*Math.PI/180);
	var k2 = Math.tan(angle2*Math.PI/180);
	var x1 = p1.x;
	var y1 = p1.y;
	var x2 = p2.x;
	var y2 = p2.y;

	var a1 = k1;
	var a2 = k2;
	var b1 = b2 = -1;
	var c1 = (x1*k1-y1);
	var c2 = (x2*k2-y2);

	// var graficDraw = function(k, x0, y0) {

	// 	ctx.fillStyle = "#00FFFC";
	// 	ctx.fillRect(x0-1, y0-1, 3, 3);

	// 	for (var i = x0-500; i < x0+500; i++) {
	// 		var y = k*i-k*x0+y0
	// 		ctx.fillStyle = "#FFFC00";
	// 		ctx.fillRect(i, y, 1, 1);
	// 	}
	// }

	// console.log(k1);
	// console.log(k2);

	// graficDraw(k1, x1, y1);
	// graficDraw(k2, x2, y2);

	var x = ((c1*b2 - c2*b1)/(a1*b2 - a2*b1));
	var y = ((a1*c2 - c1*a2)/(a1*b2 - a2*b1));

	// ctx.fillStyle = "red";
	// ctx.fillRect(x-1,y-1, 3, 3);

	return {x:x, y:y};

}

var blockCreate = function(i) {
	var a = points[i];
	var b = points[i-1];

	var blockPointPosition = function(point, angle){

		var x = point.x + blockHeight * Math.cos(angle*Math.PI/180);
		var y = point.y + blockHeight * Math.sin(angle*Math.PI/180);

		return {x:x, y:y};
	}

	var A, B, C, D;
	console.log(i);
	if(i == 1) {
		A = blockPointPosition(b, a.angle-90);
		D = blockPointPosition(b, a.angle+90);;
	}
	else {
		console.log(blocks[i-2]);
		A = blocks[i-2].points[2];
		D = blocks[i-2].points[1];
	}

	if(i == points.length-1) {
		B = blockPointPosition(a, a.angle-90);;
		C = blockPointPosition(a, a.angle+90);;
	}
	else {
		B = intersection(A, blockPointPosition(points[i+1], points[i+1].angle+90), points[i].angle, points[i+1].angle);
		C = intersection(D, blockPointPosition(points[i+1], points[i+1].angle-90), points[i].angle, points[i+1].angle);
	}


	blocks.push(Object.create(blockProto).constructor(A, B, C, D));

};

function angleValue(obj) {
	var a = (Math.atan((yMouse - obj.y) / (xMouse - obj.x)));
	if( (xMouse - obj.x) < 0 ) { a = Math.PI + a; }
	if( ((xMouse - obj.x) < 0) && ((yMouse - obj.y) < 0) ) {
		a = -(2* Math.PI - a);
	}
	return a;
}


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

var pointsDraw = function() {
	ctx.clearRect(0, 0, w, h);

	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#3BFF5B";

	ctx.moveTo(points[0].x, points[0].y);

	points.forEach(function(item, i, arr){
		ctx.lineTo(item.x, item.y);
	});

	ctx.stroke();
	ctx.closePath();

	points.forEach(function(item, i, arr){
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.arc(item.x, item.y, 5, 0, 2 * Math.PI, true);
		ctx.strokeStyle = "#fff";
		ctx.stroke();
		ctx.closePath();
	});
};

pointsCreate();
init();
pointsDraw();

document.onclick = function(e){
	pointsMove(e.clientX, e.clientY);
	console.log(blocks);
};



