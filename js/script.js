var canvas = document.getElementById("canvas");

var w = canvas.clientWidth;
var h = canvas.clientHeight;

var xMouse = 0;
var yMouse = 0;

var blockWidth =50;

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


var points= [];

var pointProto = {
	constructor:function(x, y){
		this.x = x;
		this.y = y;
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


	for (var i = cpId+1; i < points.length; i++) {

		var alfa = getRandomInt(75, 125);
		if (angle < -45) {
			rotation = true;
		}
		if (angle > 45) {
			rotation = false;
		}
		
		if(rotation == true) {
			angle = angle + (180 - alfa);
		}

		if(rotation == false) {
			angle = angle - (180 - alfa);
		}

		points[i].x = points[i-1].x + Math.cos((angle/180)*Math.PI)*(getRandomInt(blockWidth*0.7, blockWidth*1.5))*2;
		points[i].y = points[i-1].y + Math.sin((angle/180)*Math.PI)*getRandomInt(blockWidth*0.7, blockWidth*1.5);
		
	}
	angle = angle = anglePoints(points[cpId-1], points[cpId]);

	for (var i = cpId -1; i > 0; i--) {
		var alfa = getRandomInt(75, 125);
		if (angle < -45) {
			rotation = true;
		}
		if (angle > 45) {
			rotation = false;
		}
		
		if(rotation == true) {
			angle = angle - (alfa - 180);
		}

		if(rotation == false) {
			angle = angle + (alfa - 180);
		}

		points[i-1].x = points[i].x - Math.cos((angle/180)*Math.PI)*(getRandomInt(blockWidth*0.7, blockWidth*1.5))*2;
		points[i-1].y = points[i].y - Math.sin((angle/180)*Math.PI)*getRandomInt(blockWidth*0.7, blockWidth*1);
	}






	pointsDraw();
}

function angleValue(obj) {
	var a =  (Math.atan((yMouse - obj.y) / (xMouse - obj.x)));
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
};


