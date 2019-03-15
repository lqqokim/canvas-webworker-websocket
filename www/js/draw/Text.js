export default class Text {
	constructor(app) {
		this.app = app;

		this.currentCount = {
			num: undefined,
			txt: undefined,
		};

		this.requestSec = {
			num: undefined,
			txt: undefined,
		};

		this.responseSec = {
			num: undefined,
			txt: undefined,
		};

		this.warning = {
			num: undefined,
			txt: undefined,
		};

		this.normal = {
			num: undefined,
			txt: undefined,
		};

		this.alarm = {
			num: undefined,
			txt: undefined,
		};

		this.width = this.app.getWidth();
		this.height = this.app.getHeight();
	}

	init() {
		this.initCurrentCount();
		this.initRequestSec();
		this.initResponseSec();
		this.initWarning();
		this.initNormal();
		this.initAlarm();
	}

	initCurrentCount() {
		const commH = (this.height / 2) - (50 + 50);
		const leftMargin = 10;

		this.currentCount.num = this.createText('0', 50, 30, leftMargin, commH, 25, '#cccccc', 'right');
		this.currentCount.txt = this.createText('현재 전체 건수', 150, 30, leftMargin + 55, commH, 15, '#cccccc', 'left');
	}

	initRequestSec() {
		const commH = (this.height / 2) - (50);
		const leftMargin = 10;

		this.requestSec.num = this.createText('0', 50, 30, leftMargin, commH, 25, '#cccccc', 'right');
		this.requestSec.txt = this.createText('요청/초', 150, 30, leftMargin + 55, commH, 15, '#cccccc', 'left');
	}

	initResponseSec() {
		const commH = (this.height / 2) - (50);
		const leftMargin = this.width - 120;

		this.responseSec.num = this.createText('0', 150, 30, leftMargin + 55, commH, 25, '#cccccc', 'left');
		this.responseSec.txt = this.createText('응답/초', 50, 30, leftMargin, commH, 15, '#cccccc', 'right');
	}

	initWarning() {
		const commH = (this.height / 2) - (50 + 50);
		const leftMargin = (this.width / 2) - (105 / 2);

		this.warning.num = this.createText('0', 50, 30, leftMargin, commH, 25, '#ffff33', 'right');
		this.warning.txt = this.createText('경고', 50, 30, leftMargin + 55, commH, 15, '#cccccc', 'left');
	}

	initNormal() {
		const commH = (this.height / 2) - (50 + 50);
		const leftMargin = (this.width / 2) - (105 / 2) - 120;

		this.normal.num = this.createText('0', 50, 30, leftMargin, commH, 25, '#99ccff', 'right');
		this.normal.txt = this.createText('정상', 50, 30, leftMargin + 55, commH, 15, '#cccccc', 'left');
	}

	initAlarm() {
		const commH = (this.height / 2) - (50 + 50);
		const leftMargin = (this.width / 2) - (105 / 2) + 120;

		this.alarm.num = this.createText('0', 50, 30, leftMargin, commH, 25, '#ff3333', 'right');
		this.alarm.txt = this.createText('심각', 50, 30, leftMargin + 55, commH, 15, '#cccccc', 'left');
	}

	createText(txt, w, h, x, y, size, color, align) {
		const cont = this.app.create.container(w, h);

		cont.ctx.font = (size === undefined) ? '22px MS' : size + 'px MS';
		cont.ctx.fillStyle = (color === undefined) ? '#333333' : color;
		cont.ctx.textAlign = (align === undefined) ? 'left' : align;
		cont.ctx.textBaseline = 'middle';

		let alignX = 0;
		switch (cont.ctx.textAlign) {
			case 'left':
				alignX = 0;
				break;
			case 'center':
				alignX = w / 2;
				break;
			case 'right':
				alignX = w;
				break;
		}

		cont.alignX = alignX;
		cont.alignY = h / 2;

		cont.ctx.fillText(txt, cont.alignX, cont.alignY);
		cont.x = x;
		cont.y = y;

		//temp lines
		// cont.ctx.fillStyle = '#ffffff';
		// cont.ctx.rect(0, 0, cont.ctx.canvas.width, cont.ctx.canvas.height);
		// cont.ctx.stroke();

		this.app.add(cont);
		return cont;
	}

	changeNum(type, num) {
		let item;

		switch (type) {
			case 'current_count':
				item = this.currentCount;
				break;
			case 'request_sec':
				item = this.requestSec;
				break;
			case 'response_sec':
				item = this.responseSec;
				break;
			case 'warning':
				item = this.warning;
				break;
			case 'normal':
				item = this.normal;
				break;
			case 'alarm':
				item = this.alarm;
				break;
		}

		item.num.ctx.clearRect(0, 0, item.num.ctx.canvas.width, item.num.ctx.canvas.height);
		item.num.ctx.fillText(num, item.num.alignX, item.num.alignY);
	}

	update() {
		
	}
}