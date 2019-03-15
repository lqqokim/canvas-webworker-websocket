import Canvas from './Canvas.js';
import CanvasCreate from './CanvasCreate.js';

export default class CanvasRender {

	//draw 에 필요한 요소들
	BG_COLOR = "#393C43";
	drawObjs = [];

	constructor(targetElId, LoadPacketShape) {

		//캔바스 생성
		const canvas = new Canvas(targetElId);
		this.ctx = canvas.getContext();

		//캔바스 오브젝트 생성관련
		this.create = new CanvasCreate(canvas, LoadPacketShape); //이미지, 스프라이트
		this.getCanvasHeight = this.getHeight;
		this.getCanvasWidth = this.getWidth;
		this.process();
	}

	update() {
		//외부에 update 가 있으면 실행
		(this.hasOwnProperty('updateObj')) && (
			this.updateObj()
		);
	}

	//오브젝트들 그리기
	draw() {
		this.drawBackground();
		
		const drawObjs = this.drawObjs;
		const drawObjsSize = drawObjs.length;

		for(let i = 0; i < drawObjsSize; i++) {
			const drawObj = this.drawObjs[i];

			if(!drawObj.isHidden) { // hidden이 아닐때
				this.ctx.drawImage(drawObj.ctx.canvas, drawObj.x, drawObj.y); //drawImage 를 통해 캔버스를 그린다. 이미지를 바로 박아넣지 않았다.
			}
		}
	}

	//캔버스 배경색
	drawBackground() {
		this.ctx.fillStyle = this.BG_COLOR;
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}

	//애니메이션 프로세스
	process() {
		this.update();
		this.draw();
		window.requestAnimationFrame(() => { //초당 60프레임(0.16초 간격)으로 process 반복
			this.process();
		}); // request 프레임 돌리고나서의 시점의 this 가 window 가 된다.
	}

	//캔버스 너비 가져오기
	getWidth() {
		return this.ctx.canvas.width;
	}

	//캔버스 높이 가져오기
	getHeight() {
		return this.ctx.canvas.height;
	}

	//그려질 오브젝트 추가
	add(obj) {
		this.drawObjs.push(obj);
	}

	//그려질 오브젝트 검색
	search(obj) {
		return this.drawObjs.indexOf(obj);
	}

	//순서 교체
	changeIndex(obj_a, obj_b) { //obj_a: 빨 obj_b: 파노
		const drawObjs = this.drawObjs.slice(0);
		const obj_a_idx = this.search(obj_a);
		const obj_b_idx = this.search(obj_b);

		this.remove(obj_b); //파노 임시로 뺀다

		drawObjs.splice(obj_a_idx, 1, obj_b); // 빨 위치에 파노 넣어줌과 동시에 빨 임시로 뺀다.
		drawObjs.splice(obj_b_idx, 0, obj_a); // 파노 위치에 빨을 넣어준다.
		this.drawObjs = drawObjs;
	}

	//그려진 오브젝트 삭제
	remove(obj) {
		const index = this.search(obj);
		this.drawObjs.splice(index, 1);
	}
}