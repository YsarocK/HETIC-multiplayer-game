import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import { config as DotEnvConfig } from 'dotenv'
import cors from 'cors'

DotEnvConfig()

const PORT = process.env.SOCKET_PORT || 3000;

const app: Express = express();

app.use(cors({ origin: '*' }))

app.get('/', (req: Request, res: Response) => {
  res.json({ message: `Socket server listening on port ${PORT}` });
});

interface Player {
  id: string;
  position: {
    x: number;
    y: number;
  }
}

interface Game {
  players: Player[];
  state: 'waiting' | 'playing';
}

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
})

const pong: Game = {
  players: [],
  state: 'waiting',
}

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`);

  if(pong.players.length === 2) {
    pong.players = [
      pong.players[1],
      {
        id: socket.id,
        position: {
          x: 0,
          y: 0,
        }
      }
    ];

    io.emit('switchPlayerIndex', pong.players);
  }

  if(pong.players.length < 2) {
    pong.players.push({
      id: socket.id,
      position: {
        x: 0,
        y: 0,
      }
    })
    pong.state = 'waiting';
  }

  io.emit('game', pong);

  socket.on('startGame', () => {
    pong.state = 'playing';
    io.emit('startgame');
    io.emit('game', pong)
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })

  socket.on('pong', () => {
    io.emit('game', pong);
  })

  socket.on('p1_move', (direction) => {
    io.emit('p1_move', direction)
  })

  socket.on('p1_stop', () => {
    io.emit('p1_stop')
  })

  socket.on('p2_move', (direction) => {
    io.emit('p2_move', direction)
  })

  socket.on('p2_stop', () => {
    io.emit('p2_stop')
  })

  socket.on('ball_position', (position) => {
    io.emit('ball_position', position)
  })
});

httpServer.listen(PORT);
