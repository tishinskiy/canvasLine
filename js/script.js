var canvas = document.getElementById("canvas");

var w = canvas.clientWidth;
var h = canvas.clientHeight;


var blockWidth =300;
var lineHeight;
var blockHeight =  Math.round(blockWidth / 3);
var startColor = "#D6D6D6";
var lineColor = ["#FF6D40", "#FFA904", "#F3FC05", "#00AB04"];
var finishColor = "#0462BB";
var angleMin = 60;
var angleMax = 140;

var rgbColor = function(hex) {
	return [parseInt(hex.substring(1,3),16), parseInt(hex.substring(3,5),16), parseInt(hex.substring(5,7),16)];
}
var rgb = rgbColor(startColor);
var color1 = "rgba("+(rgb[0])+", "+(rgb[1])+", "+(rgb[2])+", 1)";
var color2 = "rgba("+(rgb[0])+", "+(rgb[1])+", "+(rgb[2])+", 1)";


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
	for (var i = -w; i <= w*2; i = i + blockWidth) {
		points.push(Object.create(pointProto).constructor(i, blockHeight/2));
		current.push(Object.create(pointProto).constructor(i, blockHeight/2));
	}
}

var pointsMove = function() {
	var cpId = Math.round(points.length / 2)
	var cp = points[cpId];
	var rotation = true;
	lineHeight =  Math.round(blockWidth / 3);
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

var pointsStart = function() {
	lineHeight = $('header').innerHeight();
	var sp = -w;
	for (var i = 0; i < points.length; i++) {
		points[i].x = sp;
		sp = sp + blockWidth;
		points[i].y = lineHeight/2;
		points[i].angle = 0;
	}
}
var pointsFinish = function() {
	lineHeight = $('footer').innerHeight();
	var sp = -w;
	for (var i = 0; i < points.length; i++) {
		points[i].x = sp;
		sp = sp + blockWidth;
		points[i].y = h - lineHeight/2;
		points[i].angle = 0;
	}
}

var DrowLine = function() {

	var blockDraw = function(obj) {

		if(blocks.indexOf(obj) & 1) {ctx.fillStyle = color1;}
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

	// console.log(current[0].x);

	// help circle draw

	// current.forEach(function(item, i, arr){
	// 	ctx.beginPath();
	// 	ctx.lineWidth = 1;
	// 	ctx.arc(item.x, item.y, 5, 0, 2*Math.PI, true);
	// 	ctx.strokeStyle = "red";
	// 	ctx.stroke();
	// 	ctx.closePath();
	// });

	// ctx.beginPath();
	// ctx.lineWidth = 1;
	// ctx.strokeStyle = "#03BE3C";
	// current.forEach(function(item, i, arr){
	// 	ctx.lineTo(item.x, item.y);
	// });
	// ctx.stroke();
	// ctx.closePath();
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

	if(kz > angleMax+5) {z = -1;}

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

var colorMove = function(color, i, k) {
	var cn = rgbColor(color);

	color1 = "rgba("+Math.round(rgb[0]+(cn[0]-rgb[0])/i)+", "+Math.round(rgb[1]+(cn[1]-rgb[1])/i)+", "+Math.round(rgb[2]+(cn[2]-rgb[2])/i)+", 1)";
	color2 = "rgba("+Math.round(rgb[0]+(cn[0]-rgb[0])/i-k)+", "+Math.round(rgb[1]+(cn[1]-rgb[1])/i-k)+", "+Math.round(rgb[2]+(cn[2]-rgb[2])/i-k)+", 1)";
}


var lineMove = function(poinsAction, color_2, darc=0) {
	// color2 = "rgba("+(rgb[0]-50)+", "+(rgb[1]-50)+", "+(rgb[2]-50)+", 1)";
	poinsAction();
	var shag = 50;
	var j = 0;

	var cpId = Math.round(points.length / 2)

	var kadr = setInterval(function(){
		clearInterval(kadr-1);
		blockHeight = blockHeight + (lineHeight - blockHeight) / (shag -j)

		for (var i = current.length - 1; i >= 0; i--) {

			current[i].x = current[i].x + (points[i].x - current[i].x) / (shag -j);
			current[i].y = current[i].y + (points[i].y - current[i].y) / (shag -j);
		}

		for (var i = current.length - 1; i > 0; i--) {
			var a = Math.atan((current[i].y - current[i-1].y) / (current[i].x - current[i-1].x));
			if ((current[i].x - current[i-1].x) < 0) {
				a = Math.PI + a;
				if ((current[i].x - current[i-1].x) < 0) {
					a = -(2*Math.PI - a);
				}
			}
			current[i].angle = a*180/Math.PI;
		}
		colorMove(color_2, shag -j, darc);
		j++;
		
		DrowLine();

		if (j == shag) {
			rgb = rgbColor(color_2);
			clearInterval(kadr);
		}
	}, 80);
}

var init = function() {
	ctx = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
}


var scrollAction = (function(){
	var sect = 0;
	var act;

	return function(top){
		var move = function(sect){

			if (sect > 0) {
				var aColor;

				if(Array.isArray(lineColor)){

					if(lineColor[sect-1]) {aColor = lineColor[sect-1];}
					else {aColor = lineColor[lineColor.length-1];}
				}
				else {aColor = lineColor;}


				act = setTimeout(function(){lineMove(pointsMove, aColor, 50)}, 100);
			}

			if ((sect == 0) || (sect == undefined)) {
				act = setTimeout(function(){lineMove(pointsStart,startColor)}, 10);
			}
			if (sect == -1) {
				act = setTimeout(function(){lineMove(pointsFinish,finishColor)}, 10);
			}
			clearInterval(act-1);
		};

		var ts;
		if (top + $(window).innerHeight() + $('footer').innerHeight() >= $(document).innerHeight() ) {
			move(-1);
			ts = -1;
			sect = -1;
		}
		else {

			for (var i = 0 - 1; i < hrefTop.length; i++) {
				if ((top >= hrefTop[i]) && (top < hrefTop[i+1])) {
					ts = i;
				}
			}
			if (ts != sect) {
				sect = ts
				move(sect);
			}
		}
	};
}());

var hrefTop = [0];
$('h3').each(function(){
	hrefTop.push($(this).offset().top);
});

$(document).ready(function(){

	$(document).scroll(function(){
		scrollAction($(this).scrollTop());
	})
});


pointsCreate();
init();
scrollAction();