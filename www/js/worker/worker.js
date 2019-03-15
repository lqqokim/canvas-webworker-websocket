//worker 생성
const packetStackWorker = new Worker('./js/worker/packet-collector.js');

export default packetStackWorker;