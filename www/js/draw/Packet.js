import Sprite from './Sprite.js';

class Packet {
  constructor(app) {
    this.app = app;
    this.init = this.init;
    this.update = this.update;
    this.createPacketLoop = this.createPacketLoop;

    this.packets = [];
    this.packets_buff = []; //정렬용
    // this.MOVE_IMAGES = {
    //   BLUE: '/images/SpeedSQ_BLUE.png',
    //   RED: '/images/SpeedSQ_RED.png',
    //   YELLOW: '/images/SpeedSQ_YELLOW.png'
    // };

    // this.WAIT_IMAGES = {
    //   BLUE: '/images/nBLUE.png',
    //   RED: '/images/nRED.png',
    //   YELLOW: '/images/nYELLOW.png'
    // };
    this.MOVE_IMAGES = {
      BLUE: 'packet_move_blue',
      RED: 'packet_move_red',
      YELLOW: 'packet_move_yellow'
    };

    this.WAIT_IMAGES = {
      BLUE: 'packet_wait_blue',
      RED: 'packet_wait_red',
      YELLOW: 'packet_wait_yellow'
    };

    this.PACKET_ARROW = {
      LEFT: 'left',
      RIGHT: 'right'
    };

    this.PACKET_TYPE = {
      NORMAL: 'normal',
      WARNING: 'warning',
      ALARM: 'alarm'
    };

    this.PACKET_STATE = {
      INPUT: 'input',
      WAIT: 'wait',
      OUTPUT: 'output',
      END: 'end'
    };

    this.type_state_count = {
      normal: 0,
      alarm: 0,
      warning: 0
    };

    this.inputCount = 0;
    this.outputCount = 0;

    this.spriteInfo = new Sprite(app);
    // this.text = new Text(app);
  }

  init() {
    // this.createPacketLoop();
    this.updateInput();
    this.updateOutput();
  }

  update() {
    let i = 0;
    let len = this.packets.length;

    while (i < len) {
      this.packets[i].updateSprite();
      i++;
    }
  }

  createPacket(delay, isHidden) {
    // 1 ~ 20초 랜덤 시간 설정
    // const waitTime = Math.floor(Math.random() * 20) + 1;
    const waitTime = delay;
    let inputImage = this.MOVE_IMAGES.BLUE;
    let outputImage = this.MOVE_IMAGES.RED;
    let waitImage = this.WAIT_IMAGES.RED;
    let packetType = this.PACKET_TYPE.ALARM;

    // 랜덤시간 0~5초 BLUE
    if (waitTime <= 5) {
      outputImage = this.MOVE_IMAGES.BLUE;
      waitImage = this.WAIT_IMAGES.BLUE;
      packetType = this.PACKET_TYPE.NORMAL;
    }
    // 랜덤시간 6~10초 YELLOW
    else if (waitTime <= 10) {
      outputImage = this.MOVE_IMAGES.YELLOW;
      waitImage = this.WAIT_IMAGES.YELLOW;
      packetType = this.PACKET_TYPE.WARNING;
    }

    // (0: input/ 1: wait/ 2: output) 이미지 등록
    const sprite = this.app.create.sprite([inputImage, waitImage, outputImage]);

    sprite.isHidden = isHidden;

    // 패킷 상태 (input/output/stay)
    sprite.state = this.PACKET_STATE.INPUT;
    sprite.type = packetType;
    sprite.waitTime = waitTime * 1000; // 자바스크립트 기준 시간계산

    sprite.x = this.spriteInfo.get_input_start_x();
    sprite.y = this.spriteInfo.get_vertical_mid(); // y축 중심 설정
    sprite.speed = 5; //패킷 속도

    sprite.get_x_rand = this.spriteInfo.get_x_rand.bind(this.spriteInfo); //연결

    // sprite.set_x_rand = function (rand_x) {
    //   sprite.target_x = rand_x;//target_x: 랜덤으로 이동할 위치
    sprite.set_x_rand = () => {
      sprite.target_x = sprite.get_x_rand(); //target_x: 랜덤으로 이동할 위치
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
      if (sprite.state === this.PACKET_STATE.INPUT && sprite.x < this.spriteInfo.get_input_end_x()) {
        sprite.x += sprite.speed;

        // input x축 마지막 위치를 넘어갔을 때 -> hidden 풀어준다
        if (sprite.x >= this.spriteInfo.get_input_end_x()) {
          sprite.state = this.PACKET_STATE.WAIT;
          sprite.changeSprite(1);
          sprite.isHidden = false; //보여준다.

          // y축 랜덤
          sprite.x = this.spriteInfo.get_x_rand();
          sprite.y = this.spriteInfo.get_y_rand();

          // x축 랜덤 세팅
          // sprite.set_x_rand(this.spriteInfo.get_x_rand());
          sprite.set_x_rand();

          // 패킷 상태 업데이트 (카운트)
          this.updatePacketState(this.PACKET_STATE.WAIT, sprite.type);


          // 대기 시간 뒤에 output 처리
          setTimeout(() => {
            sprite.state = this.PACKET_STATE.OUTPUT;
            sprite.changeSprite(2);
            sprite.x = this.spriteInfo.get_output_start_x() - 130;
            sprite.y = this.spriteInfo.get_vertical_mid();
            this.updatePacketState(this.PACKET_STATE.OUTPUT, sprite.type);
          }, sprite.waitTime);
        }
      } else if (sprite.state == this.PACKET_STATE.OUTPUT && sprite.x < this.spriteInfo.get_output_end_x()) {
        sprite.x += sprite.speed;

        // output x축 마지막 위치를 넘어갔을 때
        if (sprite.x >= this.spriteInfo.get_output_end_x()) {
          sprite.state = this.PACKET_TYPE.END;
          this.app.remove(sprite);
        }
      } else if (sprite.state == this.PACKET_STATE.WAIT) {
        sprite.x += sprite.wait_speed;

        if (sprite.wait_arrow == this.PACKET_ARROW.RIGHT && sprite.x >= sprite.target_x) {
          // sprite.set_x_rand(this.spriteInfo.get_x_rand());
          sprite.set_x_rand();
        } else if (sprite.wait_arrow == this.PACKET_ARROW.LEFT && sprite.x <= sprite.target_x) {
          // sprite.set_x_rand(this.spriteInfo.get_x_rand());
          sprite.set_x_rand();
        }
      }
    }

    // 패킷 이미지 등록
    this.app.add(sprite);
    this.packets.push(sprite);

    if (sprite.type !== this.PACKET_TYPE.ALARM) {
      const alarmPacket = this.searchFirstAlarmPacket();
      alarmPacket && (
        // this.changePackets(alarmPacket, sprite),
        this.app.changeIndex(alarmPacket, sprite)
      );
    }

    if (sprite.type === this.PACKET_TYPE.NORMAL) {
      const warningPacket = this.searchFirstWarningPacket();
      warningPacket && (
        // this.changePackets(warningPacket, sprite),
        this.app.changeIndex(warningPacket, sprite)
      );
    }
  }

  searchFirstAlarmPacket() {
    for (let i = 0; i < this.packets.length; i++) {
      if (this.packets[i].type === this.PACKET_TYPE.ALARM) {
        return this.packets[i];
      }
    }

    return false;
  }

  searchFirstWarningPacket() {
    for (let i = 0; i < this.packets.length; i++) {
      if (this.packets[i].type === this.PACKET_TYPE.WARNING) {
        return this.packets[i];
      }
    }

    return false;
  }

  //packets도 변경된 drawObjs 기준으로 맞춰준다.
  changePackets(obj_a, obj_b) { //obj_a: 빨 obj_b: 파노
    const obj_a_idx = this.packets.indexOf(obj_a);
    const obj_b_idx = this.packets.indexOf(obj_b);

    const tmp_b = this.packets.splice(obj_b_idx, 1);//파노 임시로 뺀다
    const tmp_a = this.packets.splice(obj_a_idx, 1, tmp_b[0]); // 빨 위치에 파노 넣어줌과 동시에 빨 임시로 뺀다.
    this.packets.splice(obj_b_idx, 0, tmp_a[0]); // 파노 위치에 빨을 넣어준다.
    // console.log(obj_a_idx, obj_b_idx)
  }

  updatePacketState(type, state) {
    if (type == 'wait') {
      this.type_state_count[state]++;
    } else if (type == 'output') {
      this.type_state_count[state]--;
      this.outputCount++;
    }

    this.text.changeNum('normal', this.type_state_count.normal);
    this.text.changeNum('alarm', this.type_state_count.alarm);
    this.text.changeNum('warning', this.type_state_count.warning);

    this.text.changeNum('current_count', (
      this.type_state_count.warning +
      this.type_state_count.alarm +
      this.type_state_count.warning
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
      const isHidden = i === 0 ? false : true; //0일때만 그려준다, 묶여서 들어왔을때 첫번째만 그려주고 아니면 안그린다.
      this.createPacket(data[i].delay, isHidden);
    }

    this.inputCount += data.length;
  }
}

export default Packet;