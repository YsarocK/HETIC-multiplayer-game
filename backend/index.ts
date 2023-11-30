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
    origin: /* process.env.FRONT_URL */'*',
  }
})

httpServer.listen(PORT);

const pong: Game = {
  players: [],
  state: 'waiting',
}

io.on('connection', (socket) => {
  console.log('user connected');

  socket.emit('id', socket.id);

  if(pong.players.length < 2) {
    pong.players.push({
      id: socket.id,
      position: {
        x: 0,
        y: 0,
      }
    })

    io.emit('game', pong);
  }

  if(pong.players.length === 2) {
    pong.state = 'playing';
    io.emit('game', pong);
  }

  if(pong.players.length < 2) {
    pong.state = 'waiting';
    io.emit('game', pong);
  }

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })

  socket.on('new_user', () => {
    io.emit('new_user', 'Hello new user ' + socket.id);
    console.log('new user message');
  })
});
