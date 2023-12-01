const socket = io('localhost:3001');

console.log('coonnect')

// Game content
let game = undefined;

// Socket player ID
let id = undefined;

// Player 1 (left) or 2 (right)
let player = undefined;

socket.on('connect', () => {
    console.log('debug')
    id = socket.id;
});

socket.on('game', (pong) => {
    if(player === undefined) {
        player = id === pong.players[0].id ? 1 : 2;
    }
})