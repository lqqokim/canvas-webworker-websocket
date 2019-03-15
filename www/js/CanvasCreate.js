export default class CanvasCreate {
	constructor(canvas, LoadPacketShape) {
		this.canvas = canvas;
		this.LoadPacketShape = LoadPacketShape;
	}

	//캔버스에 그릴 기본적인 오브젝트
	createContainer(buffCtx) {
		return {
			ctx: buffCtx,
			x: 0,
			y: 0,
			isHidden: false //isHidden이 true이면 감추고 false면 보여준다.
		};
	}

	container(w, h) {
		return this.createContainer(this.canvas.createCanvas(w, h));
	}

	createImage(url) {
		let ctx = this.canvas.createCanvas();
		let img = document.createElement('img');
		img.src = url;
	
		ctx.drawImage(img, 0, 0);// 캔버스에 임시로 그린다
	
		return createContainer(ctx);//이미지를 넘기는게 아니라 이미지를 그린 캔버스 컨텍스트를 넘긴다
	  }

	createSprite(ctxIds) {
		let ctx = this.canvas.createCanvas();
		let ctxs = [];

		// packet shape종류 만큼 ctx 생성
		for(let i = 0; i < ctxIds.length; i++) {
			ctxs[i] = this.LoadPacketShape.getCtxId(ctxIds[i]);
		}

		// 첫번째 이미지 그리기
		ctx.drawImage(ctxs[0].canvas, 0, 0);

		// 커스텀 컨테이너 세팅
		let container = this.createContainer(ctx);

		// packet shape 등록
		container.ctxs = ctxs;

		// packet shape 교체
		container.changeSprite = function (idx) {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.drawImage(this.ctxs[idx].canvas, 0, 0);
		}

		return container;
	}
}