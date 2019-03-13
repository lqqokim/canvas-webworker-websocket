const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer((request, response) => {
    // console.log('request', request, 'response', response);
});

server.listen(8080, (event) => {
    console.log('Express App on port 8080!');
});

const wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', function (request) {
    console.log('Server Connect!');
    const connection = request.accept(null, request.origin);
    packet_loop(connection);
});

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
function packet_loop(connection) {
    connection.send(JSON.stringify(createPacket()));

    setTimeout(() => {
        packet_loop(connection);
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