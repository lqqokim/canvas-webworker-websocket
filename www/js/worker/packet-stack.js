//websocket 생성
const webSocket = new WebSocket('ws://127.0.0.1:1000');

//packet을 쌓는 공간
const packetStack = [];

//server로 부터의 응답 수신
webSocket.onmessage = function (event) {
    //개별적인 packet을 packetStack에 쌓는다.
    packetStack.push(JSON.parse(event.data));
    new Map
};

//error 발생시 수행
webSocket.onerror = function (event) {
    console.error(event)
};

//일정 시간 간격으로 stack에 쌓아둔 packet 묶음을 내보낸다.
function timeCheckLoop() {
    sendPacketStack(packetStack);
    packetStack.splice(0);
    setTimeout(timeCheckLoop, 200);
}

function sendPacketStack(data) {
    //worker객체로 보낸다.
    this.postMessage(data);
}

timeCheckLoop();