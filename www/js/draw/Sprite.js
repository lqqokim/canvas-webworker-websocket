export default class Sprite {
	constructor(app) {
		this.app = app;
	}

	getInputStartX() {
		return -108;
	}

	getInputEndX() {
		const divideWidth = this.app.getWidth() / 5;
		return divideWidth * 2;
	}

	getOutPutStartX() {
		const divideWidth = this.app.getWidth() / 5;
		return (divideWidth * 3) - 20;
	}

	getOutputEndX() {
		return this.app.getWidth();
	}

	getVerticalMid() {
		return (this.app.getHeight() * 0.5) - (22 * 0.5); //기본값 수직중앙
	}

	//대기중인 packet이 좌우로 이동하는 랜덤 거리
	getRandX() {
		const start_x = this.getInputEndX();
		const end_x = this.getOutPutStartX();
		const width = end_x - start_x;
		const randWidth = Math.floor(Math.random() * width);

		return start_x + randWidth;
	}

	getRandY() {
		const v_mid = this.getVerticalMid() - 50;
		const add_y = Math.floor(Math.random() * 100);

		return v_mid + add_y;
	}
}