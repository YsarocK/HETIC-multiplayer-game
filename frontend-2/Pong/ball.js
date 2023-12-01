import { Vector2 } from "./vector2.js";

export function Ball(options, socket) {

  this.position = [50, 50]
  this.radius = 10;
  this.speed = 250;

  this.player = document.querySelector('#playerNumber').innerHTML

  this.ballPositionInGame = this.position;

  socket.on('ball_position', (position) => {
    this.ballPositionInGame = position;
  })

  let dir = Vector2.normalize([1, 2]);

  const randomHorReflect = (d, mult) => {
    return Vector2.normalize([-d[0] + Math.random() * 0.5 * mult, d[1] + (Math.random() * 0.5)]);
  }

  this.update = (delta) => {

    this.position = Vector2.add(this.position, Vector2.multiply(dir,this.speed * delta));

    // Right paddle
    if (this.position[0] + this.radius > options.rightPaddle.position[0] && 
        this.position[1] >= options.rightPaddle.position[1] &&
        this.position[1] <= options.rightPaddle.position[1] + options.rightPaddle.height
      ) {
      // Hit right paddle
      dir = randomHorReflect(dir, -1);
    } 
    else if (this.position[0] - this.radius < options.leftPaddle.position[0] + options.leftPaddle.width && 
      this.position[1] >= options.leftPaddle.position[1] &&
      this.position[1] <= options.leftPaddle.position[1] + options.leftPaddle.height
    ) {
      // Hit left paddle
      dir = randomHorReflect(dir, 1);
    } 
    else if (this.position[0] + this.radius < 0) {
      // Hit left
      options.onEscape({ winner: 'right', loser: 'left'})
      
    } else if (this.position[0] + this.radius > options.width) {
      // Hit right
      options.onEscape({ winner: 'left', loser: 'right'})

    } else  if (this.position[1] - this.radius < 0) {
      // Hit top
      dir = [dir[0], -dir[1]]
    } else if (this.position[1] + this.radius > options.height) {
      // Hit bottom
      dir = [dir[0], -dir[1]]
    }

    if(this.player == 1) {
      socket.emit('ball_position', this.position)
    }

  }
  this.draw = () => {
    const position = this.ballPositionInGame;
    options.ctx.fillStyle = "#000000";
    options.ctx.beginPath();
    options.ctx.arc(position[0], position[1], this.radius, 0, 2 * Math.PI);
    options.ctx.fill();

  }
} 