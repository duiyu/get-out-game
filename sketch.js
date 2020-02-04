const yGround = 370;

let xiaowang;
let ground;
let cityBackground;
let barriers;

let state;
let wasXiaowangGotCaught;
let xiaowangGotCaughtTime;

let barrierSpeed;
let minDistanceBetweenBarriers;
let nextSpawnDistance;

let landingTime;
let dist;
let distFrame;
let carouselX;

let xiaowangSpriteSheetNormal, xiaowangSpriteSheetMasked, xiaowangSpriteSheetDead;
let virusSprite1, virusSprite2, virusSprite3;
let policeSprite, maskSprite;
let bannerImg, tvLogoImg;
let gateImg, backgroundImg;

let xiaowangJumpSound, xiaowangLandingSound;
let virusSound, policeSound, maskSound, gameoverSound;
let backgroundMusic;

function preload() {
	// xiaowang sprite sheets
	xiaowangSpriteSheetNormal = loadImage('assets/images/xiaowang-normal.png');
	xiaowangSpriteSheetMasked = loadImage('assets/images/xiaowang-masked.png');
	xiaowangSpriteSheetDead = loadImage('assets/images/xiaowang-dead.png');
	// virus sprites
	virusSprite1 = loadImage('assets/images/virus1.png');
	virusSprite2 = loadImage('assets/images/virus2.png');
	virusSprite3 = loadImage('assets/images/virus3.png');
	// other sprites
	policeSprite = loadImage('assets/images/police.png');
	maskSprite = loadImage('assets/images/mask.png');
	// interface
	bannerImg = loadImage('assets/images/banner.png');
	tvLogoImg = loadImage('assets/images/tv-logo.png');
	// background
	gateImg = loadImage('assets/images/gate.png');
	backgroundImg = loadImage('assets/images/background.jpg');
	// sounds
	xiaowangJumpSound = loadSound('assets/sounds/jump.mp3');
	xiaowangLandingSound = loadSound('assets/sounds/superherolanding.mp3');
	virusSound = loadSound('assets/sounds/virus1.mp3');
	policeSound = loadSound('assets/sounds/police.mp3');
	maskSound = loadSound('assets/sounds/mask.mp3');
	gameoverSound = loadSound('assets/sounds/gameover.mp3');
	// music
	backgroundMusic = loadSound('assets/sounds/background.mp3');
}

function setup() {
	createCanvas(800, 450);
	frameRate(30);

	backgroundMusic.setVolume(0.3);
	carouselX = width

	state = 'init';
	wasXiaowangGotCaught = false;
	xiaowangGotCaughtTime = 0;
	resetGame();
	noLoop();
}

function resetGame() {
	cityBackground = new Background(2000-10, 400-15, backgroundImg);
	ground = new Ground(yGround);
	gate = new Gate(90, 288, 288, gateImg);
	xiaowang = new Xiaowang(xiaowangJumpSound,
							yGround,
					  		xiaowangSpriteSheetNormal,
					  		xiaowangSpriteSheetMasked,
							xiaowangSpriteSheetDead, 3, 48, 96);
	barrierSpeed = 6;
	minDistanceBetweenBarriers = 175;
	barriers = [new Police(width, ground.y, policeSprite, barrierSpeed)];
	
	dist = 700.0;
	distFrame = 0;
	landingTime = 0;
	loop();
}

function draw() {
	background(19,21,18);
	
	// draw background with or without fading
	if(state === 'landing') {
		if(landingTime === 25) {
			if(!wasXiaowangGotCaught) {
				xiaowangLandingSound.play();
				backgroundMusic.loop();
			}
		} else if(landingTime >= 60) {
			state = 'running';
			wasXiaowangGotCaught = false;
		}
		cityBackground.draw();
		let c = color(0, 0, 0, 255-landingTime*255/30);
		fill(c);
		noStroke();
		rect(0, 0, width, height);
		landingTime += 1;
	} else if(state === 'running') {
		cityBackground.update();
		cityBackground.draw();
		// draw gate
		gate.update();
	}
	gate.draw();

	if(barriers.length <= 0 || width - barriers[barriers.length - 1].x >= nextSpawnDistance) {
		switch(randInt(1,5)) {
			case 1:
				barriers.push(new Virus(width, ground.y, virusSprite1, barrierSpeed));
				break;
			case 2:
				barriers.push(new Virus(width, ground.y, virusSprite2, barrierSpeed));
				break;
			case 3:
				barriers.push(new Virus(width, ground.y, virusSprite3, barrierSpeed));
				break;
			case 4:
				barriers.push(new Mask(width, ground.y, maskSprite, barrierSpeed));
				break;
			case 5:
				barriers.push(new Police(width, ground.y, policeSprite, barrierSpeed));
				break;
		}
		nextSpawnDistance = random(minDistanceBetweenBarriers, width*0.9);
	}

	// loop through all the barriers and update them
	for(let i=barriers.length-1; i>=0; i--) {
		if(state === 'running') {
			barriers[i].update();
		}
		barriers[i].draw();

		if(state === 'running') {
			if(barriers[i] instanceof Virus) {
				if (!barriers[i].hasTriggered() && barriers[i].checkIfCollision(xiaowang)) {
					barriers[i].trigger();
					if(xiaowang.isMasked()) {
						// defend against virus
						virusSound.play();
					} else {
						// killed by virus
						xiaowang.die();
						state = 'gameover';
						backgroundMusic.stop();
						gameoverSound.play();
						noLoop();
					}
				}
			} else if(barriers[i] instanceof Mask) {
				if (!barriers[i].hasTriggered() && barriers[i].checkIfCollision(xiaowang)) {
					// get a mask
					barriers[i].trigger();
					xiaowang.getMask();
					maskSound.play();
				}
			} else if(barriers[i] instanceof Police) {
				if (!barriers[i].hasTriggered() && barriers[i].checkIfCollision(xiaowang)) {
					barriers[i].trigger();
					policeSound.play();
					resetGame();
					state = 'landing';
					wasXiaowangGotCaught = true;
					xiaowangGotCaughtTime += 1;
				}
			}
			if(state === 'running' && barriers[i].getRight() < 0) {
				barriers.splice(i, 1);
			}
		}
	}
	xiaowang.update(yGround);
	xiaowang.draw();
	drawInterface();
}

function drawInterface() {
	image(bannerImg, 0, 375);

	fill(255);
	textAlign(LEFT, BOTTOM);
	textSize(15);
	carouselText = 'Get out of Wuhan before it’s quarantined!                    Collect surgical masks to protect XiaoWang from CoronaVirus.                    Avoid the police! If get caught, XIaoWang needs to start running away again from the city center.'
	text(carouselText, carouselX, 446);
	carouselX -= 2;
	if(carouselX < -1400) carouselX = width;

	noStroke();
	fill(225, 20, 0, 255);
	rect(0, 427, 119, 23);

	if(state === 'running') {
		distFrame += 1;
		if(distFrame >= 5) {
			dist -= 0.01;
			distFrame = 0;
			barrierSpeed = ((800 - dist)/100)**3*6;
			minDistanceBetweenBarriers = 175 + (barrierSpeed-6)*15;
		}
	}

	fill(255);
	textAlign(LEFT, BOTTOM);
	textSize(24);
	text(dist.toFixed(2) + ' KILOMETERS UNTIL GET OUT', 130, 423);
	textAlign(CENTER, BOTTOM);
	textSize(18);
	let d = new Date;
	let t = d.toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric"});
	text(t, 65, 447.5);

	if(state === 'init') {
		// dark overlay
		fill(0, 0, 0, 125);
		rect(0, 0, width, height);
		// game info text
		fill(255);
		textAlign(CENTER, BOTTOM);
		textSize(140);
		text('GET OUT', width / 2, 1.5*height / 3);
		textSize(15);
		text('Press SPACE BAR to play!', width / 2, 2*height / 3);
	} else if(state === 'landing' && wasXiaowangGotCaught) {
		let t = 'This is your ' + (xiaowangGotCaughtTime+1).toString();
		(xiaowangGotCaughtTime+1 > 1) ? t += ' attempts to get out of here!' : t += ' attempt to get out of here!';
		fill(255);
		textAlign(CENTER, CENTER);
		textSize(25);
		text(t, width/2, height/2);
	} else if(state === 'gameover') {
		// dark overlay
		fill(0, 0, 0, 125);
		rect(0, 0, width, height);
		// game over text
		textAlign(CENTER, BOTTOM);
		textSize(35);
		fill(255);
		text('GAME OVER!', width / 2, height / 3);
		textSize(15);
		text('With extreme limited medical resources in Hubei,', width / 2, 1.5*height/3);
		text('As of Feb 3, there are 17,238 confirmed cases in China & 361 deaths and counting ...', width / 2, 1.5*height/3+20);
		textSize(12);
		text('Press SPACE BAR to play again.', width / 2, 2*height/3);
	}
	image(tvLogoImg, 35, 26, 100, 23);
}

function keyPressed() {
	if(key === ' ') {
		if(state === 'init') {
			state = 'landing';
			loop();
		} else if(state === 'running' && xiaowang.isOnGround()) {
			xiaowang.jump();
		} else if(state === 'gameover') {
			resetGame();
			carouselX = width;
			state = 'landing';
			loop();
		}
	}
}

function touchStarted() {
	if(state === 'init') {
		state = 'landing';
		loop();
	} else if(state === 'running' && xiaowang.isOnGround()) {
		xiaowang.jump();
	} else if(state === 'gameover') {
		resetGame();
		carouselX = width;
		state = 'landing';
		loop();
	}
}

function randInt(l, h) {
	return Math.floor(Math.random() * (h - l + 1) ) + l;
}

class Background {
	constructor(imgWidth, imgHeight, img) {
		this.img = img;
		this.width = imgWidth;
		this.height = imgHeight;
		this.x = 0;
		this.speed = 4;
	}

	setSpeed(speed) {
		this.speed = speed;
	}

	getX() {
		return this.x;
	}

	getWidth() {
		return this.width;
	}

	update() {
		if(this.x < -this.width) {
			this.x = 0;
		} else {
			this.x -= this.speed;
		}
	}

	draw() {
		image(this.img, this.x, 0, this.width, this.height);
		if(this.x+this.width < width) {
			image(this.img, this.x+this.width, 0, this.width, this.height);
		}
	}
}

class Ground extends Shape {
	constructor(y) {
		let groundHeight = ceil(height - y);
		super(0, yGround, width, groundHeight);
	}
}

class Gate {
	constructor(y, imgWidth, imgHeight, img) {
		this.x = 0;
		this.y = y;
		this.width = imgWidth;
		this.height = imgHeight;
		this.img = img;
		this.speed = 5;
	}

	setSpeed(speed) {
		this.speed = speed;
	}

	update() {
		this.x -= this.speed;
	}

	draw() {
		if(this.x+288 >= 0) {
			image(this.img, this.x, this.y, 288, 288);
		}
	}
}
