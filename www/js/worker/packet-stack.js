//websocket 생성
let websocket;

webSocket = new WebSocket('ws://127.0.0.1:8080');

//packet을 쌓는 공간
const packetStack = [];

console.log(websocket);

if (webSocket) {
    webSocket.onopen = onSocketOpen; //소켓연결 되었을때 
    webSocket.onclose = onSocketClose; //연결이 닫혔을때
    webSocket.onmessage = onSocketMessage; //server로부터 데이터 수신할때
    webSocket.onerror = onSocketError //통신에 오류가 있을때

    timeCheckLoop();
} else {

}

function onSocketOpen(event) {
    console.log("Socket is now open.");
    webSocket.send("Hello from my first live web socket!");
}

function onSocketClose(event) {
    console.log("Socket is now closed.");
}

function onSocketMessage(event) {
    // console.log("Recieved from socket: ", JSON.parse(event.data));

    //개별적인 packet을 packetStack에 쌓는다.
    packetStack.push(JSON.parse(event.data));
}

function onSocketError(event) {
    console.log("Error with/from socket!:");
}

function closeSocket() {
    webSocket.close();
    console.log(webSocket)
    // if (mySocket.readyState !== mySocket.CLOSED) {
    //     console.log("Closing socket from our end (timer).");
    //     mySocket.close();
    // } else
    //     console.log("Socket was already closed (timer).");
}

//일정 시간 간격으로 stack에 쌓아둔 packet 묶음을 내보낸다.
function timeCheckLoop() {
    sendPacketStack(packetStack);
    packetStack.splice(0);
    setTimeout(timeCheckLoop, 200);
}

function sendPacketStack(data) {
    //worker객체로 보낸다.
    // console.log('send to worker', data.length);
    this.postMessage(data);
}