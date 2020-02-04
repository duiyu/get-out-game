class Barrier extends Shape {
	constructor(x, y, yGround, width, height, speed) {
		let y2 = yGround - y - height;
		super(x, y2, width, height);
		this.speed = speed;
		this.triggered = false;
	}

	checkIfCollision(shape) {
		return this.overlaps(shape);
	}

	trigger() {
		this.triggered = true;
	}

	hasTriggered() {
		return this.triggered;
	}

	update() {
		this.x -= this.speed;
	}
}

class Mask extends Barrier {
	constructor(x, yGround, img, speed) {
        let y = random(0, 200);
        let maskWidth = 48;
        let maskHeight = 24;
		super(x, y, yGround, maskWidth, maskHeight, speed);
		this.img = img;
	}
	
	draw() {
        if(!this.triggered) {
            image(this.img, this.x, this.y, this.width, this.height);
        }
	}	
}

class Virus extends Barrier {
    constructor(x, yGround, img, speed) {
		let virusWidth = 36;
		let virusHeight = 36;
        super(x, 12, yGround, virusWidth, virusHeight, speed);
		this.img = img;
    }

	draw() {
		image(this.img, this.x+random(-0.5, 0.5), this.y+random(-0.5, 0.5), this.width, this.height);
	}
}

class Police extends Barrier {
    constructor(x, yGround, img, speed) {
		let virusWidth = 54;
		let virusHeight = 96;
        super(x, 0, yGround, virusWidth, virusHeight, speed);
		this.img = img;
    }

	draw() {
		image(this.img, this.x, this.y, this.width, this.height);
	}
}