const webSocketServer = require('websocket').server;
const http = require('http');

//Websocket 연결을 위해 HTTP 프로토콜 기반으로 서버생성
const server = http.createServer((request, response) => {});
let connection;

//server가 대기하는 포트 설정
server.listen(8080, (event) => {
    console.log('Websocket based app on port 8080!');
});

//웹소켓 생성
const wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', function (request) {
    console.log('Server Connect!');

    connection = request.accept(null, request.origin);

    //client에서 send 했을때 들어온다.
    connection.on('message', function (message) {
        console.log('client message', message);
    });

    packet_loop();
});

wsServer.on('disconnect', function () {
    console.log('disconnect!')
})

//packet이 생성되는 주기에 관여
const PACKET_LOOP_TIME_RANGE = {
    start: 1,
    end: 200
};

//각각의 packet이 가진 랜덤 대기시간에 관여
const PACKET_DELAY_RAND_TIME = {
    start: 0,
    end: 20
};

//랜덤시간 간격으로 packet을 생성하여 client(packet-stack)으로 전달
function packet_loop() {
    connection.send(JSON.stringify(createPacket()));

    setTimeout(() => {
        packet_loop();
        // console.log('Random paket create time', random(PACKET_LOOP_TIME_RANGE.start, PACKET_LOOP_TIME_RANGE.end))
    }, random(PACKET_LOOP_TIME_RANGE.start, PACKET_LOOP_TIME_RANGE.end));
}

//랜덤 대기시간을 가진 packet 생성
function createPacket() {
    return {
        delay: random(PACKET_DELAY_RAND_TIME.start, PACKET_DELAY_RAND_TIME.end)
    }
}

function random(start, end) {
    return Math.floor(Math.random() * end) + start;
}

/*

Websocket 정리    

[개념]
    - 서버와 클라이언트 간에 Socket Connection을 유지해서 언제든 양방향 통신 
      또는 데이터 전송이 가능하도록 하는 기술이다.

[작동원리]    
    - 서버와 클라이언트 간의 WebSocket연결은 HTTP프로토콜을 통해 이루어지고
      연결이 정상적으로 이루어 진다면 서버와 클라이언트 간에 WebSocket연결이 
      이루어진후, 일정 시간이 지나면 HTTP연결은 자동으로 끊어진다.

[HTTP통신 방법과 Websocket의 차이점]      
    - 결정적인 차이는 프로토콜이다. WebSocket 프로토콜은 접속 확립에 HTTP를 
      사용하지만, 그 후 통신은 WebSocket 독자의 프로토콜로 이루어진다.
        또한, header가 상당히 작아 overhead가 적은 특징이 있다. 장시간 접속을 
      전제로 하기 때문에, 접속한 상태라면 클라이언트나 서버로부터 데이터 송신이 
      가능하다. 더불어 데이터의 송신과 수신에 각각 커넥션을 맺을 필요가 없어 
      하나의 커넥션으로 데이터를 송수신 할 수 있다. 

[Event]
    - socket.onopen
    - socket.onmessage
    - socket.onerror
    - socket.onclose

[데이터교환]
    - socket.send (); 전송
    - socket.close (); 연결 종료
*/