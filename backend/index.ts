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

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: /* process.env.FRONT_URL */'*',
  }
})

httpServer.listen(PORT);

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })

  socket.on('new_user', () => {
    io.emit('new_user', 'Hello new user ' + socket.id);
    console.log('new user message');
  })
});
