//worker 생성
const PacketStackWorker = new Worker('./js/worker/packet-stack.js');

export default PacketStackWorker;