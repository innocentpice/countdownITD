import $ from "jquery";
import moment from "moment";
import "./style.scss";
import "./fireworks.scss";
import "./bee.scss";

const $clock = $("#clock");
let eventTime = moment("03-09-2018 07:00:00", "DD-MM-YYYY HH:mm:ss").unix();
let currentTime = moment().unix();
let diffTime = eventTime - currentTime;
let duration = moment.duration(diffTime * 1000, "milliseconds");
const interval = 1000;

if (diffTime > 0) {
	setInterval(function() {
		duration = moment.duration(
			duration.asMilliseconds() - interval,
			"milliseconds"
		);
		let diffTime = eventTime - currentTime;
		if (diffTime < 0) {
			location.reload();
		}
		let d = moment.duration(duration).days();
		let h = moment.duration(duration).hours();
		let m = moment.duration(duration).minutes();
		let s = moment.duration(duration).seconds();

		d = $.trim(d).length === 1 ? "0" + d : d;
		h = $.trim(h).length === 1 ? "0" + h : h;
		m = $.trim(m).length === 1 ? "0" + m : m;
		s = $.trim(s).length === 1 ? "0" + s : s;

		newTime([d, h, m, s]);
	}, interval);
} else {
	$("body").addClass("active");
}

function initClock() {
	const now = new Date();
	const dateArray = [0, 0, 0, 0];

	dateArray.forEach(function(number, i) {
		if (String(number).length == 1) {
			var output = "0" + String(number);
		} else {
			var output = String(number);
		}

		$(
			".clock > span:nth-child(" + (i + 1) + ") .digit:nth-child(1) .showing"
		).html(output[0]);
		$(
			".clock > span:nth-child(" + (i + 1) + ") .digit:nth-child(2) .showing"
		).html(output[1]);
	});
}

function newTime(value) {
	const dateArray = value;

	dateArray.forEach(function(number, i) {
		if (String(number).length == 1) {
			var output = "0" + String(number);
		} else {
			var output = String(number);
		}

		var digitOne = $(
			".clock > span:nth-child(" + (i + 1) + ") .digit:nth-child(1) .showing"
		).html();
		if (digitOne != output[0]) {
			$(
				".clock > span:nth-child(" + (i + 1) + ") .digit:nth-child(1) .below"
			).html(output[0]);
			$(".clock > span:nth-child(" + (i + 1) + ") .digit:nth-child(1) .showing")
				.removeClass("showing")
				.addClass("above");

			setTimeout(function() {
				$(".clock > span:nth-child(" + (i + 1) + ") .digit:nth-child(1) .below")
					.removeClass("below")
					.addClass("showing");
			}, 400);

			setTimeout(function() {
				$(".clock > span:nth-child(" + (i + 1) + ") .digit:nth-child(1) .above")
					.removeClass("above")
					.addClass("below");
			}, 600);
		}

		var digitTwo = $(
			".clock > span:nth-child(" + (i + 1) + ") .digit:nth-child(2) .showing"
		).html();
		if (digitTwo != output[1]) {
			$(
				".clock > span:nth-child(" + (i + 1) + ") .digit:nth-child(2) .below"
			).html(output[1]);
			$(".clock > span:nth-child(" + (i + 1) + ") .digit:nth-child(2) .showing")
				.removeClass("showing")
				.addClass("above");

			setTimeout(function() {
				$(".clock > span:nth-child(" + (i + 1) + ") .digit:nth-child(2) .below")
					.removeClass("below")
					.addClass("showing");
			}, 400);

			setTimeout(function() {
				$(".clock > span:nth-child(" + (i + 1) + ") .digit:nth-child(2) .above")
					.removeClass("above")
					.addClass("below");
			}, 600);
		}
	});
}

initClock();
// setInterval(newTime, 1000);

// fireworks

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const colours = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"];

let balls = [];
let pressed = false;
let longPressed = false;
let longPress;
let multiplier = 0;
let width, height;
let origin;
let normal;

// Make the canvas high res
function updateSize() {
	canvas.width = window.innerWidth * 2;
	canvas.height = window.innerHeight * 2;
	canvas.style.width = window.innerWidth + "px";
	canvas.style.height = window.innerHeight + "px";
	ctx.scale(2, 2);

	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;
	origin = {
		x: width / 2,
		y: height / 2
	};
	normal = {
		x: width / 2,
		y: height / 2
	};
}

updateSize();
window.addEventListener("resize", updateSize, false);

class Ball {
	constructor(x = origin.x, y = origin.y) {
		this.x = x;
		this.y = y;
		this.angle = Math.PI * 2 * Math.random();

		if (longPressed == true) {
			this.multiplier = randBetween(14 + multiplier, 15 + multiplier);
		} else {
			this.multiplier = randBetween(6, 12);
		}

		this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
		this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
		this.r = randBetween(8, 12) + 3 * Math.random();
		this.color = colours[Math.floor(Math.random() * colours.length)];
		this.direction = randBetween(-1, 1);
	}

	update() {
		this.x += this.vx - normal.x;
		this.y += this.vy - normal.y;

		normal.x = (-2 / window.innerWidth) * Math.sin(this.angle);
		normal.y = (-2 / window.innerHeight) * Math.cos(this.angle);
		// normal.y = ((-2 / window.innerHeight) * Math.cos(this.angle)) + this.direction;

		this.r -= 0.3;
		this.vx *= 0.9;
		this.vy *= 0.9;
	}
}

function pushBalls(count = 1, x = origin.x, y = origin.y) {
	for (let i = 0; i < count; i++) {
		balls.push(new Ball(x, y));
	}
}

function randBetween(min, max) {
	return Math.floor(Math.random() * max) + min;
}

loop();

function loop() {
	// Alpha means "motion blur", yay!
	// ctx.fillStyle = "rgba(20, 24, 41, 0.7)";
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < balls.length; i++) {
		let b = balls[i];

		if (b.r < 0) continue;

		ctx.fillStyle = b.color;
		ctx.beginPath();
		ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
		ctx.fill();

		b.update();
	}

	if (longPressed == true) {
		multiplier += 0.2;
	} else if (!longPressed && multiplier >= 0) {
		multiplier -= 0.4;
	}

	removeBall();
	requestAnimationFrame(loop);
}

function removeBall() {
	for (let i = 0; i < balls.length; i++) {
		let b = balls[i];
		if (
			b.x + b.r < 0 ||
			b.x - b.r > width ||
			b.y + b.r < 0 ||
			b.y - b.r > height ||
			b.r < 0
		) {
			balls.splice(i, 1);
		}
	}
}

window.addEventListener(
	"mousedown",
	function(e) {
		// if (pressed == false) clearInterval(timeOut);

		pressed = true;
		pushBalls(randBetween(10, 20), e.clientX, e.clientY);

		document.body.classList.add("is-pressed");
		longPress = setTimeout(function() {
			document.body.classList.add("is-longpress");
			longPressed = true;
		}, 500);
	},
	false
);

window.addEventListener(
	"mouseup",
	function(e) {
		clearInterval(longPress);
		//multiplier = 0;

		// Superblast
		if (longPressed == true) {
			document.body.classList.remove("is-longpress");
			pushBalls(
				randBetween(50 + Math.ceil(multiplier), 100 + Math.ceil(multiplier)),
				e.clientX,
				e.clientY
			);
			longPressed = false;
		}

		document.body.classList.remove("is-pressed");
	},
	false
);

// Keep it going
let timeOut = setInterval(function() {
	pushBalls(
		randBetween(15, 65),
		origin.x + randBetween(-300, 600),
		origin.y + randBetween(-300, 600)
	);
}, 850);

// Pointer stuff
const pointer = document.createElement("span");
pointer.classList.add("pointer");
document.body.appendChild(pointer);

window.addEventListener(
	"mousemove",
	function(e) {
		let x = e.clientX;
		let y = e.clientY;

		pointer.style.top = y + "px";
		pointer.style.left = x + "px";
	},
	false
);
