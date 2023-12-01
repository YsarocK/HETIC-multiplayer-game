import { Paddle } from "./paddle.js";
import { Ball } from "./ball.js";
import { Text } from "./text.js";

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
    document.querySelector('#playerNumber').innerHTML = player;
    document.querySelector('#playerId').innerHTML = id;
  }
})

socket.on('switchPlayerIndex', (players) => {
  const index = players.findIndex(player => player.id === id);
  if(index === -1) return

  document.querySelector('#playerNumber').innerHTML = players.findIndex(player => player.id === id) + 1;
})


export function Pong(canvas, socket) {
  const ctx = canvas.getContext("2d");

  let lastTime = Date.now() / 1000.0;
  let text = undefined;
  let ball = undefined;
  
  // Left paddle
  const paddleLeft = new Paddle({
    ctx,
    down: "s",
    up: "z",
    height: canvas.height,
    player: 1
  }, socket);
  paddleLeft.position[0] = 0;

  // Right paddle
  const paddleRight = new Paddle({
    ctx,
    down: "ArrowDown",
    up: "ArrowUp",
    height: canvas.height,
    player: 2
  }, socket);
  paddleRight.position[0] = 580;

  socket.on('p1_move', (direction) => {
    console.log(direction)
    if(paddleLeft) paddleLeft.move(direction)
  })

  socket.on('p1_stop', () => {
    if(paddleLeft) paddleLeft.stop()
  })

  socket.on('p2_move', (direction) => {
    if(paddleRight) paddleRight.move(direction)
  })

  socket.on('p2_stop', () => {
    if(paddleRight) paddleRight.stop()
  })

  // The ball
  function createBall() {
    ball = new Ball({
      ctx,
      width: canvas.width,
      height: canvas.height,
      leftPaddle: paddleLeft,
      rightPaddle: paddleRight,
      onEscape: (result) => {
  
        if (ball) {
          ball = undefined;
          text = new Text({ ctx, text: "Gagnant: " + (result.winner === 'left' ? 'Gauche' : 'Droit')});
          text.position = [
            canvas.width / 2.0,
            canvas.height / 2.0
          ]
          endGame();
        }
  
      }
    },
        socket, player);
    ball.position = [ canvas.width / 2.0, canvas.height / 2.0 ];
  
  }

  
  function endGame() {
    setTimeout(
      () => {
        text = undefined;
        createBall();
      },
      3000
    )
  }

  // The animation loop
  function loop() {
    const time = Date.now() / 1000.0;
    let delta = time - lastTime;
    lastTime = time;

    // First update the position of all the objects
    paddleLeft.update(delta);
    paddleRight.update(delta);
    if (ball) { ball.update(delta); }
    if (text) { text.update(delta); }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all the objects
    paddleLeft.draw();
    paddleRight.draw();

    if (ball) { ball.draw(); }
    if (text) { text.draw(); }

    // Program the next animation frame
    requestAnimationFrame(loop);
  }

  createBall();

  // Start the game
  requestAnimationFrame(loop)

}

// const pong = setTimeout(() => new Pong(document.getElementById('elcanva'), socket), 500)

socket.on('startgame', () => {
  new Pong(document.getElementById('elcanva'), socket)
})

document.querySelector('#startgame').addEventListener('click', () => {
    socket.emit('startGame')
})