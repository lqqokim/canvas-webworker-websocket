import Canvas from './Canvas.js';

export default class LoadPacketShape extends Canvas {

    // 미리 그릴 packet shape와 함수 매칭
    preloadPacketShapeFuncs = {
        move_blue: this.getMoveBlueCtx.bind(this),
        move_red: this.getMoveRedCtx.bind(this),
        move_yellow: this.getMoveYellowCtx.bind(this),

        wait_blue: this.getWaitBlue.bind(this),
        wait_red: this.getWaitRed.bind(this),
        wait_yellow: this.getWaitYellow.bind(this)
    };

    // 미리 그려질 컨텍스 저장 용
    preloadShapeCtx = {};

    constructor() {
        super();
    }

    // (외부) 그려질 도형 이미지가 다 준비 되었을 때 호출 될 함수
    onload() {

    }

    // (move) 파랑
    getMoveBlueCtx() {
        let ctx = this.createCanvas(110, 20);

        const grd = ctx.createRadialGradient(
            100, 10, 2,
            100, 10, 10
        );
        grd.addColorStop(0, "#ccccffcc");
        grd.addColorStop(1, "#99ccffcc");

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(100, 10, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        const grd2 = ctx.createLinearGradient(0, 10, 90, 10);
        grd2.addColorStop(0, "#99ccff00");
        grd2.addColorStop(1, "#99ccffcc");

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
    getMoveRedCtx() {
        let ctx = this.createCanvas(110, 20);

        const grd = ctx.createRadialGradient(
            100, 10, 2,
            100, 10, 10
        );
        grd.addColorStop(0, "#ffcccccc");
        grd.addColorStop(1, "#ff0000cc");

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(100, 10, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        const grd2 = ctx.createLinearGradient(0, 10, 90, 10);
        grd2.addColorStop(0, "#ff000000");
        grd2.addColorStop(1, "#ff0000cc");

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
    getMoveYellowCtx() {
        let ctx = this.createCanvas(110, 20);

        const grd = ctx.createRadialGradient(
            100, 10, 2,
            100, 10, 10
        );
        grd.addColorStop(0, "#ffffcccc");
        grd.addColorStop(1, "#ffff00cc");

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(100, 10, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        const grd2 = ctx.createLinearGradient(0, 10, 90, 10);
        grd2.addColorStop(0, "#ffff0000");
        grd2.addColorStop(1, "#ffff00cc");

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
    getWaitBlue() {
        let ctx = this.createCanvas(20, 20);

        const grd = ctx.createRadialGradient(
            10, 10, 2,
            10, 10, 10
        );
        grd.addColorStop(0, "#99ccff00");
        grd.addColorStop(1, "#99ccffee");

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(10, 10, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        return ctx;
    }
    // (대기) 빨강
    getWaitRed() {
        let ctx = this.createCanvas(20, 20);

        const grd = ctx.createRadialGradient(
            10, 10, 2,
            10, 10, 10
        );
        grd.addColorStop(0, "#ff000000");
        grd.addColorStop(1, "#ff0000ee");

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(10, 10, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        return ctx;
    }
    // (대기) 노랑
    getWaitYellow() {
        let ctx = this.createCanvas(20, 20);

        const grd = ctx.createRadialGradient(
            10, 10, 2,
            10, 10, 10
        );
        grd.addColorStop(0, "#ffff0000");
        grd.addColorStop(1, "#ffff00ee");

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(10, 10, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        return ctx;
    }

    //packet shape 불러오기 시작
    startLoad() {
        // key값과 매칭된 함수를 수행하여 ctx를 미리 만들어 저장
        for (const key in this.preloadPacketShapeFuncs) {
            this.preloadShapeCtx[key] = this.preloadPacketShapeFuncs[key]();
        }

        //packet shape 로드 끝 
        this.onload();
    };

    // 미리 로드된 도형 context 가져오기
    getCtxId(ctxId) {
        if (this.preloadShapeCtx.hasOwnProperty(ctxId)) {
            return this.preloadShapeCtx[ctxId];
        }
        
        return false;
    }
}