import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import { config as DotEnvConfig } from 'dotenv'
import cors from 'cors'

import type { Game } from '../frontend/types/game'

DotEnvConfig()

const PORT = process.env.SOCKET_PORT || 3000;

const app: Express = express();

app.use(cors({ origin: '*' }))

app.get('/', (req: Request, res: Response) => {
  res.json({ message: `Socket server listening on port ${PORT}` });
});

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

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })

  socket.on('pong', () => {
    io.emit('game', pong);
  })
});

httpServer.listen(PORT);
