//websocket 생성
const webSocket = new WebSocket('ws://127.0.0.1:8080');

//packet을 쌓는 공간
const packetStack = [];

//pakcet 생성 여부를 결정하는 flag
let isLoop = false;

if (webSocket) {
    webSocket.onopen = onOpen; //소켓연결 되었을때 
    webSocket.onclose = onClose; //연결이 닫혔을때
    webSocket.onmessage = onMessage; //server로부터 데이터 수신할때
    webSocket.onerror = onError; //통신에 오류가 있을때
}

function onOpen(event) {
    console.log("[Open] Socket is now open.");
    webSocket.send("Hello from my first live web socket!");

    isLoop = true;
    timeCheckLoop();
}

function onClose(event) {
    console.log("[Close] Socket is now closed.");
    isLoop = false;
}

function onMessage(event) {
    // console.log("Recieved from socket: ", JSON.parse(event.data));

    //개별적인 packet을 packetStack에 쌓는다.
    packetStack.push(JSON.parse(event.data));
}

function onError(event) {
    console.log("Error with/from socket!:");
}

function closeSocket() {
    webSocket.close();
}

//일정 시간 간격으로 stack에 쌓아둔 packet 묶음을 내보낸다.
function timeCheckLoop() {
    if (!isLoop) return;

    sendPacketStack(packetStack);
    packetStack.splice(0);
    setTimeout(timeCheckLoop, 200);
}

function sendPacketStack(data) {
    //worker객체로 보낸다.
    this.postMessage(data);
}


