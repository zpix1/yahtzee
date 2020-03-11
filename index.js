var io = require('socket.io')(3000);
io.origins('*:*');
var userToSessionCode = {};
var sessionCodesDB = {};

function getSessionCode() {
    let sessionCode = Math.round(Math.random()*2000+1011);
    let exitIndex = 0;
    while (sessionCodesDB[sessionCodesDB] != undefined) {
        sessionCode = Math.round(Math.random()*2000+1011);
        if (exitIndex > 2000) {
            return null;
        }
    }
    sessionCodesDB[sessionCode] = { players: [], state: {}};
    return sessionCode;
}

function addUserToSessionCode(sessionCode, socket) {
    sessionCodesDB[sessionCode].players.push(socket);
    userToSessionCode[socket] = sessionCode;
    // emitGroup(sessionCode, ({action: 'alert', message: 'a new player connected'}));
}

function emitGroup(sessionCode, message) {
    if (sessionCodesDB[sessionCode] != undefined)
    for (let i = 0; i < sessionCodesDB[sessionCode].players.length; i++) {
        sessionCodesDB[sessionCode].players[i].emit('message', message);
    }
}

function filterState(state) {
    return true;
    for (k in state) {
        if (!['scores', 'rollsLeft', 'playerTurn', 'dice', 'rollButtonMessage'].includes(k)) {
            return false;
        }
    }
    return true;
}

io.on('connection', function(socket) {
    console.log('a user connected');
    
    socket.on('message', function(msg) {
        console.log(msg);
        if (msg.action === 'host') {
            let sessionCode = getSessionCode();
            console.log(sessionCode);
            if (sessionCode === null) {
                socket.emit('message', {action: 'error', message: 'no more space for you'});
                return;
            }
            console.log(sessionCode);
            addUserToSessionCode(sessionCode, socket);

            socket.emit('message', {action: 'conn_ok', sessionCode: sessionCode});
        } else if (msg.action === 'join') {
            let sessionCode = msg.sessionCode;
            if (!sessionCode.match(/^\d{4}$/g) || sessionCodesDB[sessionCode] === undefined) {
                socket.emit('message', {action: 'error', message: 'this session does not exist'});
                return;
            }

            if (sessionCodesDB[sessionCode].players.length > 2) {
                socket.emit('message', {action: 'error', message: 'no more than 2 players'});
                return;
            }

            addUserToSessionCode(sessionCode, socket);

            if (sessionCodesDB[sessionCode].players.length == 2) {
                for (let i = 0; i < sessionCodesDB[sessionCode].players.length; i++) {
                    sessionCodesDB[sessionCode].players[i].emit('message', {action: 'start', message: 'game starts', playerID: i});
                }
            }
            socket.emit('message', {action: 'conn_ok', sessionCode: sessionCode});
        } else if (msg.action === 'done') {
            let sessionCode = userToSessionCode[socket];
            if (filterState(msg.state) && sessionCodesDB[sessionCode]) {
                sessionCodesDB[sessionCode].state = msg.state;
                emitGroup(sessionCode, { action: 'update', state: msg.state });
            }
        }
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
        let sessionCode = userToSessionCode[socket];
        if (sessionCode == undefined)
            return;
        emitGroup({action: 'reset', message: 'very bad, one player left the party'});
        sessionCodesDB[sessionCode].players = sessionCodesDB[sessionCode].players.filter(s => s != socket);
        delete userToSessionCode[socket];
    });

});