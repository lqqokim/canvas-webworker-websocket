import CanvasRender from './js/CanvasRender.js';
import CanvasLoadShape from './js/CanvasLoadShape.js';
import Draw from './js/Draw.js';
import packet_stack_worker from './js/worker/worker.js';

document.addEventListener('DOMContentLoaded', () => {

  const canvas_load_shape = new CanvasLoadShape(); 

  // 도형이 로드 된 시점
  canvas_load_shape.onload = ()=>{
    const app = new CanvasRender('canvasArea', canvas_load_shape);
    new Draw(app, packet_stack_worker);
  };

  // 도형 로드 시작
  canvas_load_shape.load_start();
});