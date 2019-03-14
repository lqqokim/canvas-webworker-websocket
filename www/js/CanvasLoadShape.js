import Canvas from './Canvas.js';

class CanvasLoadShape extends Canvas {

    // 미리 그릴 모양과 함수 연결 용
    preload_shape_funcs = {
        packet_move_blue : this.ctx_packet_move_blue.bind(this),
        packet_move_red : this.ctx_packet_move_red.bind(this),
        packet_move_yellow : this.ctx_packet_move_yellow.bind(this),

        packet_wait_blue : this.ctx_packet_wait_blue.bind(this),
        packet_wait_red : this.ctx_packet_wait_red.bind(this),
        packet_wait_yellow : this.ctx_packet_wait_yellow.bind(this)
    };

    // 미리 그려질 컨텍스 저장 용
    preload_shape_ctx = {};

    constructor() {
        super();
    }

    // (외부) 그려질 도형 이미지가 다 준비 되었을 때 호출 될 함수
    onload(){}

    // (무브) 파랑
    ctx_packet_move_blue(){
        let ctx = this.createCanvas(110, 20);
        
        const grd = ctx.createRadialGradient(
            100, 10, 2,
            100, 10, 10
        );
        grd.addColorStop(0,"#ccccffcc");
        grd.addColorStop(1,"#99ccffcc");
        
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(100, 10, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        
        const grd2 = ctx.createLinearGradient(0, 10, 90, 10);
        grd2.addColorStop(0,"#99ccff00");
        grd2.addColorStop(1,"#99ccffcc");
        
        ctx.fillStyle = grd2;
        
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(100, 0);
        ctx.lineTo(90, 10);
        ctx.lineTo(100, 20);
        ctx.fill();
          
        return ctx;
    }
    // (무브) 빨강
    ctx_packet_move_red(){
        let ctx = this.createCanvas(110, 20);
        
        const grd = ctx.createRadialGradient(
            100, 10, 2,
            100, 10, 10
        );
        grd.addColorStop(0,"#ffcccccc");
        grd.addColorStop(1,"#ff0000cc");
        
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(100, 10, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        
        const grd2 = ctx.createLinearGradient(0, 10, 90, 10);
        grd2.addColorStop(0,"#ff000000");
        grd2.addColorStop(1,"#ff0000cc");
        
        ctx.fillStyle = grd2;
        
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(100, 0);
        ctx.lineTo(90, 10);
        ctx.lineTo(100, 20);
        ctx.fill();

        return ctx;
    }
    // (무브) 노랑
    ctx_packet_move_yellow(){
        let ctx = this.createCanvas(110, 20);
        
        const grd = ctx.createRadialGradient(
            100, 10, 2,
            100, 10, 10
        );
        grd.addColorStop(0,"#ffffcccc");
        grd.addColorStop(1,"#ffff00cc");
        
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(100, 10, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        
        const grd2 = ctx.createLinearGradient(0, 10, 90, 10);
        grd2.addColorStop(0,"#ffff0000");
        grd2.addColorStop(1,"#ffff00cc");
        
        ctx.fillStyle = grd2;
        
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(100, 0);
        ctx.lineTo(90, 10);
        ctx.lineTo(100, 20);
        ctx.fill();

        return ctx;
    }

    // (대기) 파랑
    ctx_packet_wait_blue(){
        let ctx = this.createCanvas(20, 20);

        const grd = ctx.createRadialGradient(
            10, 10, 2,
            10, 10, 10
        );
        grd.addColorStop(0,"#99ccff00");
        grd.addColorStop(1,"#99ccffee");
        
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(10, 10, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        return ctx;
    }
    // (대기) 빨강
    ctx_packet_wait_red(){
        let ctx = this.createCanvas(20, 20);

        const grd = ctx.createRadialGradient(
            10, 10, 2,
            10, 10, 10
        );
        grd.addColorStop(0,"#ff000000");
        grd.addColorStop(1,"#ff0000ee");
        
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(10, 10, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        return ctx;
    }
    // (대기) 노랑
    ctx_packet_wait_yellow(){
        let ctx = this.createCanvas(20, 20);

        const grd = ctx.createRadialGradient(
            10, 10, 2,
            10, 10, 10
        );
        grd.addColorStop(0,"#ffff0000");
        grd.addColorStop(1,"#ffff00ee");
        
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(10, 10, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        return ctx;
    }

    ctx_circle(){
        let ctx = this.createCanvas(20, 20);
        ctx.fillStyle = "blue"; //red
        ctx.beginPath();
        ctx.arc(10, 10, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        return ctx;
    }

    // 도형 불러오기 시작
    load_start(){

        // key값과 매칭된 함수를 구동해서 ctx를 미리 만들어 저장
        for( const key in this.preload_shape_funcs ){
            this.preload_shape_ctx[key] = this.preload_shape_funcs[key]();
        }

        // 로드 끝 
        this.onload();
    };

    // 미리 로드된 도형 context 가져오기
    get_ctx_id( ctx_id ){
        if( this.preload_shape_ctx.hasOwnProperty( ctx_id ) ){
            return this.preload_shape_ctx[ ctx_id ];
        }
        return false;
    }
}

export default CanvasLoadShape;

// 자기자신은 프로토타입이고 살은 붙인건 퍼블릭