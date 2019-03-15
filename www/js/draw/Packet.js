import Sprite from './Sprite.js';

export default class Packet {
	constructor(app) {
		this.app = app;
		this.init = this.init;
		this.update = this.update;
		this.createPacketLoop = this.createPacketLoop;

		this.packets = [];
		this.packets_buff = []; //정렬용

		// 움직이는 packet shape 가져오는 타입
		this.MOVE_PACKETS = { BLUE: 'move_blue', RED: 'move_red', YELLOW: 'move_yellow' };
		
		// 대기하는 packet shape 가져오는 타입
		this.WAIT_PACKETS = { BLUE: 'wait_blue', RED: 'wait_red', YELLOW: 'wait_yellow' };
		
		// 대기하는 패킷이 좌우 움직이는 타입
		this.PACKET_ARROW = { LEFT: 'left', RIGHT: 'right' };
		
		// packet의 noraml, warning, alarm 타입
		this.PACKET_TYPE = { NORMAL: 'normal', WARNING: 'warning', ALARM: 'alarm' };
		
		// packet의 진행상태 타입
		this.PACKET_STATE = { INPUT: 'input', WAIT: 'wait', OUTPUT: 'output', END: 'end' };
		
		// packet의 normal, warning, alarm 타입에 따른 count
		this.countByPakcetType = { normal: 0, alarm: 0, warning: 0 };

		// 요청 packet count
		this.inputCount = 0;

		// 응답 packet count
		this.outputCount = 0;

		// sprite를 만들기위한 거리, 위치. 방향정보를 가져오기 위한 객체
		this.sprite = new Sprite(app);
	}

	init() {
		this.updateInput();
		this.updateOutput();
	}

	update() {
		const packets = this.packets;
		const paketsSize = packets.length;
		for(let i = 0; i < paketsSize; i++) {
			packets[i].updateSprite();
		}
	}

	createPacket(delay, isHidden) {
		// 1 ~ 20초 랜덤 시간 설정
		const waitTime = delay;
		let inputPacket = this.MOVE_PACKETS.BLUE;
		let outputPacket = this.MOVE_PACKETS.RED;
		let waitPacket = this.WAIT_PACKETS.RED;
		let packetType = this.PACKET_TYPE.ALARM;

		// 랜덤시간 0~5초: BLUE
		if (waitTime <= 5) {
			outputPacket = this.MOVE_PACKETS.BLUE;
			waitPacket = this.WAIT_PACKETS.BLUE;
			packetType = this.PACKET_TYPE.NORMAL;
		}
		// 랜덤시간 6~10초: YELLOW
		else if (waitTime <= 10) {
			outputPacket = this.MOVE_PACKETS.YELLOW;
			waitPacket = this.WAIT_PACKETS.YELLOW;
			packetType = this.PACKET_TYPE.WARNING;
		}

		// (0: input/ 1: wait/ 2: output) 이미지 등록
		const sprite = this.app.create.createSprite([inputPacket, waitPacket, outputPacket]);

		sprite.isHidden = isHidden;

		// 패킷 상태 (input/output/stay)
		sprite.state = this.PACKET_STATE.INPUT;
		sprite.type = packetType;
		sprite.waitTime = waitTime * 1000; // 자바스크립트 기준 시간계산

		sprite.x = this.sprite.getInputStartX();
		sprite.y = this.sprite.getVerticalMid(); // y축 중심 설정
		sprite.speed = 20; //패킷 속도

		sprite.getRandX = this.sprite.getRandX.bind(this.sprite);

		sprite.setRandX = () => {
			sprite.target_x = sprite.getRandX(); //target_x: 랜덤으로 이동할 위치
			if (sprite.x < sprite.target_x) {
				sprite.wait_arrow = this.PACKET_ARROW.RIGHT; //목표지점에 대한 방향설정
				sprite.wait_speed = 1;
			} else {
				sprite.wait_arrow = this.PACKET_ARROW.LEFT;
				sprite.wait_speed = -1;
			}
		}

		sprite.updateSprite = () => {
			// input 일 때
			if (sprite.state === this.PACKET_STATE.INPUT && sprite.x < this.sprite.getInputEndX()) {
				sprite.x += sprite.speed;

				// input x축 마지막 위치를 넘어갔을 때 -> hidden 풀어준다
				if (sprite.x >= this.sprite.getInputEndX()) {
					sprite.state = this.PACKET_STATE.WAIT;
					sprite.changeSprite(1);
					sprite.isHidden = false; //보여준다.

					// y축 랜덤
					sprite.x = this.sprite.getRandX();
					sprite.y = this.sprite.getRandY();

					// x축 랜덤 세팅
					sprite.setRandX();

					// 패킷 상태 업데이트 (카운트)
					this.updatePacketState(this.PACKET_STATE.WAIT, sprite.type);


					// 대기 시간 뒤에 output 처리
					setTimeout(() => {
						sprite.state = this.PACKET_STATE.OUTPUT;
						sprite.changeSprite(2);
						sprite.x = this.sprite.getOutPutStartX() - 130;
						sprite.y = this.sprite.getVerticalMid();
						this.updatePacketState(this.PACKET_STATE.OUTPUT, sprite.type);
					}, sprite.waitTime);
				}
			} else if (sprite.state == this.PACKET_STATE.OUTPUT && sprite.x < this.sprite.getOutputEndX()) {
				sprite.x += sprite.speed;

				// output x축 마지막 위치를 넘어갔을 때
				if (sprite.x >= this.sprite.getOutputEndX()) {
					sprite.state = this.PACKET_TYPE.END;
					this.app.remove
					(sprite);
				}
			} else if (sprite.state == this.PACKET_STATE.WAIT) {
				sprite.x += sprite.wait_speed;

				if (sprite.wait_arrow == this.PACKET_ARROW.RIGHT && sprite.x >= sprite.target_x) {
					sprite.setRandX();
				} else if (sprite.wait_arrow == this.PACKET_ARROW.LEFT && sprite.x <= sprite.target_x) {
					sprite.setRandX();
				}
			}
		}

		// 패킷 이미지 등록
		this.app.add(sprite);
		this.packets.push(sprite);

		if (sprite.type !== this.PACKET_TYPE.ALARM) {
			const alarmPacket = this.searchFirstAlarmPacket();
			alarmPacket && (
				this.app.changeIndex(alarmPacket, sprite),
				this.changePackets(alarmPacket, sprite)
			);
		}

		if (sprite.type === this.PACKET_TYPE.NORMAL) {
			const warningPacket = this.searchFirstWarningPacket();
			warningPacket && (
				this.app.changeIndex(warningPacket, sprite),
				this.changePackets(warningPacket, sprite)
			);
		}
	}

	searchFirstAlarmPacket() {
		const packets = this.packets;
		const packetSize = packets.length;
		for (let i = 0; i < packetSize; i++) {
			if (packets[i].type === this.PACKET_TYPE.ALARM) {
				return packets[i];
			}
		}

		return false;
	}

	searchFirstWarningPacket() {
		const packets = this.packets;
		const packetSize = packets.length;
		for (let i = 0; i < packetSize; i++) {
			if (packets[i].type === this.PACKET_TYPE.WARNING) {
				return packets[i];
			}
		}

		return false;
	}

	//packets도 변경된 drawObjs 기준으로 맞춰준다.
	changePackets(obj_a, obj_b) { //obj_a: 빨 obj_b: 파노
		const packets = this.packets.slice(0);
		const obj_a_idx = packets.indexOf(obj_a);
		const obj_b_idx = packets.indexOf(obj_b);

		const tmp_b = packets.splice(obj_b_idx, 1); //파노 임시로 뺀다
		const tmp_a = packets.splice(obj_a_idx, 1, tmp_b[0]); // 빨 위치에 파노 넣어줌과 동시에 빨 임시로 뺀다.
		packets.splice(obj_b_idx, 0, tmp_a[0]); // 파노 위치에 빨을 넣어준다.
		this.packets = packets;
	}

	updatePacketState(type, state) {
		if (type == 'wait') {
			this.countByPakcetType[state]++;
		} else if (type == 'output') {
			this.countByPakcetType[state]--;
			this.outputCount++;
		}

		this.text.changeNum('normal', this.countByPakcetType.normal);
		this.text.changeNum('alarm', this.countByPakcetType.alarm);
		this.text.changeNum('warning', this.countByPakcetType.warning);

		this.text.changeNum('current_count', (
			this.countByPakcetType.warning +
			this.countByPakcetType.alarm +
			this.countByPakcetType.warning
		));
	}

	updateInput() {
		this.text.changeNum('request_sec', this.inputCount);
		this.inputCount = 0;

		setTimeout(() => {
			this.updateInput();
		}, 1000);
	}

	updateOutput() {
		this.text.changeNum('response_sec', this.outputCount);
		this.outputCount = 0;

		setTimeout(() => {
			this.updateOutput();
		}, 1000);
	}

	generatePacket(data) {
		for (let i = 0; i < data.length; i++) {
			//0일때만 그려준다, 묶여서 들어왔을때 첫번째만 그려주고 아니면 안그린다.
			const isHidden = i === 0 ? false : true; 
			this.createPacket(data[i].delay, isHidden);
		}

		this.inputCount += data.length;
	}
}