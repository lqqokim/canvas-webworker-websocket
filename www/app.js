import CanvasRender from './js/CanvasRender.js';
import packetStackWorker from './js/worker/worker.js';
import Draw from './js/Draw.js';
import LoadPacketShape from './js/LoadPacketShape.js';

document.addEventListener('DOMContentLoaded', () => {

	const loadPacketShape = new LoadPacketShape();

	// packet shape 로드 된 시점
	loadPacketShape.onload = () => {
		const app = new CanvasRender('canvasArea', loadPacketShape);
		new Draw(app, packetStackWorker);
	};

	// packet shape 로드 시작
	loadPacketShape.startLoad();
});