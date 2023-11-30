import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import { config as DotEnvConfig } from 'dotenv'
import cors from 'cors'

DotEnvConfig()

const PORT = process.env.SOCKET_PORT || 3000;

const app: Express = express();

app.use(cors({
  origin: process.env.FRONT_URL
}))

app.get('/', (req: Request, res: Response) => {
  res.json({ message: `Socket server listening on port ${PORT}` });
});

const httpServer = createServer(app);

const socket = new Server(httpServer, {
  cors: {
    origin: process.env.FRONT_URL,
  }
})

httpServer.listen(PORT);

socket.on('new_user', () => {
  console.log('a user connected');
})
