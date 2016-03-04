canvas = document.getElementById("canvas");

var w = canvas.clientWidth;
var h = canvas.clientHeight;

var blockHeight = 100;
var blockWidth = 300;

var centerLine = Math.round(h / 2 - blockHeight / 2);

var blockNumer =  Math.round(w / blockWidth);

var blockDefaultWidth = Math.round(w / blockNumer);
var xFault = Math.round(blockDefaultWidth * 0.4);

var fps = 30;

var getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var cR = getRandomInt(50, 200);
var cG = getRandomInt(50, 200);
var cB = getRandomInt(50, 200);

blocks= [];

blockProto = {
	constructor:function(start, width){
		this.points = [];
		this.bg = "rgb("+cR+","+ cG+","+ cB+")";
		this.points[0] = [start, 0];
		this.points[1] = [start, blockHeight];
		this.points[2] = [start+width, blockHeight];
		this.points[3] = [start+width, 0];
		return this;
	},
	draw: function() {
		drawObject(this);
	}
};

var blockCreate = function(){

	for (var i = 0; i < blockNumer; i++) {

		var start = i * blockDefaultWidth;
		blocks.push(Object.create(blockProto).constructor(start, blockDefaultWidth));
	}
}

var newPointsCreate = function() {
	console.log(centerLine);
	blocks.forEach(function(item, i, arr){
		item.newPoints = [];

		if(i == 0) {
			item.newPoints[0] = [
				item.points[0][0],
				centerLine + getRandomInt(-Math.round(centerLine * 0.7), Math.round(centerLine * 0.7))
			];
			item.newPoints[1] = [
				item.points[1][0],
				item.newPoints[0][1] + blockHeight
			];
		}
		else {
			item.newPoints[0] = blocks[i-1].newPoints[3];
			item.newPoints[1] = blocks[i-1].newPoints[2];
		}

		if (i == blocks.length) {
			item.newPoints[2] = [
				item.points[2][0] +getRandomInt(- Math.round(blockWidth * 0.4),  Math.round(blockWidth * 0.4)),
				centerLine + getRandomInt(-Math.round(centerLine * 0.7), Math.round(centerLine * 0.7))
			];
		}
		else {
			item.newPoints[2] = [
				item.points[2][0],
				centerLine + getRandomInt(-Math.round(centerLine * 0.7), Math.round(centerLine * 0.7))
			];
		}
		item.newPoints[3] = [
			item.newPoints[2][0],
			item.newPoints[2][1] - blockHeight
		];

		// console.log(item.newPoints[3][1] - centerLine);

		colorNew(item);

	});
}

var colorNew = function(obj) {
	var a = obj.newPoints[1];
	var b = obj.newPoints[2];

	obj.cK = Math.round(Math.atan((b[1] - a[1]) / (b[0] - a[0])) * 10)*3;
}

var colorMove = function(obj, i) {
	var newR = cR + ((cR + obj.cK) - cR) * (i / fps);
	var newG = cG + ((cG + obj.cK) - cG) * (i / fps);
	var newB = cB + ((cB + obj.cK) - cB) * (i / fps);

	return("rgb("+Math.round(newR)+","+ Math.round(newG)+","+ Math.round(newB)+")");
}

var pointsMove = function(){

	var cadr = function() {
		return(function(){

			ik++;

			ctx.clearRect(0, 0, w, h);
			blocks.forEach(function(item, j, arr){
				item.movePoints = [];
				item.movePoints[0] = [
					item.points[0][0] + (item.newPoints[0][0] - item.points[0][0]) * (ik / fps), 
					item.points[0][1] + (item.newPoints[0][1] - item.points[0][1]) * (ik / fps)
				];

				item.movePoints[1] = [
					item.movePoints[0][0], 
					item.movePoints[0][1] + blockHeight
				];

				item.movePoints[2] = [
					item.points[2][0] + (item.newPoints[2][0] - item.points[2][0]) * (ik / fps), 
					item.points[2][1] + (item.newPoints[2][1] - item.points[2][1]) * (ik / fps)
				];

				item.movePoints[3] = [
					item.movePoints[2][0], 
					item.movePoints[2][1] - blockHeight
				];

				ctx.fillStyle = colorMove(item, ik);
				ctx.strokeStyle = "transparent";
				ctx.lineWidth = 1;
				ctx.beginPath();

				item.movePoints.forEach(function(item, i, arr) {
					ctx.lineTo(item[0], item[1]);
				});

				ctx.fill();
				ctx.closePath();
			});
			if (ik == fps) {clearInterval(cadrTimer);
}
		});
	}

	var ik = 0;
			
	var cadrTimer = setInterval(cadr(ik), 1000/120);

}


var init = function() {
	ctx = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
}


var drawObject = function(obj) {
	ctx.fillStyle = obj.bg;
	ctx.strokeStyle = "transparent";
	ctx.lineWidth = 1;
	ctx.beginPath();

	obj.points.forEach(function(item, i, arr) {
		ctx.lineTo(item[0], item[1]);
	});

	ctx.fill();
	ctx.closePath();
}

var draw = function() {
	blocks.forEach(function(item, i, arr){
		arr[i].draw();
	});
};

blockCreate();
init();
draw();

document.onclick = function(e){
	newPointsCreate();
	pointsMove();
};
