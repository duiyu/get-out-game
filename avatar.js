class Avatar extends Shape {
	constructor(yGround, x, y, width, height) {
		super(x, y, width, height);

		this.fillColor = color(70);
		this.gravity = 0.8;
		this.jumpStrength = 30;
		this.yVelocity = 0;
		this.yGround = yGround;
	}

	jump() {
		this.yVelocity += -this.jumpStrength;
	}

	isOnGround() {
		return this.y == this.yGround - this.height;
	}

	update() {
		this.yVelocity += this.gravity;
		this.yVelocity *= 0.9; // some air resistance
		this.y += this.yVelocity;

		if (this.y + this.height > this.yGround) {
			// hit the ground
			this.y = this.yGround - this.height;
			this.yVelocity = 0;
		}
	}

	draw() {
		push();
		noStroke();
		fill(this.fillColor);
		rect(this.x, this.y, this.width, this.height);
		pop();
	}
}

class Xiaowang extends Avatar {
	constructor(jumpSound, y, sheet1, sheet2, sheet3, numFrames, xiaowangWidth, xiaowangHeight) {
		super(y, 64, y - xiaowangHeight, xiaowangWidth, xiaowangHeight);
		this.jumpSound = jumpSound;
		this.spriteSheetNormal = sheet1;
		this.spriteSheetMasked = sheet2;
		this.spriteSheetDead = sheet3;
		this.spriteFrames = numFrames;
		this.curFrame = 1;
		this.isDead = false;
		this.y = -this.height;
		// mask
		this.maskLastTime = 240;
		this.maskRemainTime = 0;
		this.countdownBarWidth = 60;
		this.countdownBarHeight = 10;
		this.countdownBarColor = color(255,255,255);
	}

	jump() {
		this.jumpSound.play();
		super.jump();
	}

	die() {
		this.isDead = true;
	}

	getMask() {
		this.maskRemainTime = this.maskLastTime;
	}

	isMasked() {
		return (this.maskRemainTime > 0);
	}

	setX(x) {
		if(x >= 36) {
			this.x = x;
		} else {
			this.x = 36;
		}
	}

	draw() {
		if (this.curFrame >= this.spriteFrames) {
			this.curFrame = 0;
		}
		let spriteFrameX = this.curFrame * this.width;

		if(this.maskRemainTime > 0) {
			image(this.spriteSheetMasked, this.x, this.y, this.width, this.height, spriteFrameX, 0, this.width, this.height);
			this.maskRemainTime -= 1;
			this.drawCountdownBar();
		} else if(this.isDead) {
			image(this.spriteSheetDead, this.x-24, this.y+50, 96, 46);
		} else {
			image(this.spriteSheetNormal, this.x, this.y, this.width, this.height, spriteFrameX, 0, this.width, this.height);
		}
		
		if (this.isOnGround()) {
			this.curFrame++;
		}
	}

	drawCountdownBar() {
		push();
		noStroke();
		fill(0);
		let bx = this.x + this.width/2 - this.countdownBarWidth/2;
		let by = this.y - 25;
		rect(bx, by, this.countdownBarWidth, 10);
		fill(this.countdownBarColor);
		rect(bx, by, this.countdownBarWidth*(this.maskRemainTime/this.maskLastTime), 10);
		pop();
	}

}