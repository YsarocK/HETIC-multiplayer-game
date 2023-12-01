export function Paddle(options, socket) {

  this.position = [0, 0];
  
  this.width = 20;
  this.height = 100;

  this.speed = 0;

  const unitsPerSecond = 250;

  addEventListener('keydown', (event) => {
    const playerNumber = document.querySelector('#playerNumber').innerHTML;
    if(playerNumber !== options.player.toString()) return

    const res = () => {
      if (event.key === options.down) {
        return unitsPerSecond;
      }

      if (event.key === options.up) {
        return -unitsPerSecond;
      }
    }


    socket.emit(`p${playerNumber}_move`, res())
  });

  addEventListener('keyup', (event) => {
    const playerNumber = document.querySelector('#playerNumber').innerHTML;
    if(playerNumber !== options.player.toString()) return

    socket.emit(`p${playerNumber}_stop`)
  })

  this.move = (direction) => {
    this.speed = direction;
  }

  this.stop = () => {
    this.speed = 0;
  }
  
  this.update = (delta) => {
    this.position[1] = this.position[1] + this.speed * delta;
    if (this.position[1] < 0) { this.position[1] = 0; }
    if (this.position[1] + this.height > options.height) { this.position[1] = options.height - this.height; }

  }

  this.draw = () => {
    options.ctx.fillRect(this.position[0], this.position[1], this.width, this.height);
  }

}