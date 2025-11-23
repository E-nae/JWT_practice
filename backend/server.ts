require('dotenv').config();
require('dotenv').config({ path: '.env.development' });
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as http from 'http';
import * as session from 'express-session';
import * as MemoryStore from 'memorystore';
import { v4 as uuidv4 } from 'uuid';
import helmet from 'helmet';
import routes from './router';

const app: Express = express();

const MemoryStoreSession = MemoryStore(session);

interface SessionData {
  genid: (req: Request) => string;
  secret: string | undefined;
  resave: boolean;
  saveUninitialized: boolean;
  cookie: {};
  store: any;
}

let sess: SessionData = {
  genid: (req: Request) => {
    return uuidv4(); // use UUIDs for session IDs
  },
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {},
  store: new MemoryStoreSession({
    checkPeriod: 86400000, // prune expired entries every 24h
  }),
};

app.use(session(sess));

const httpServer = http.createServer(app);

const socketIO = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  logger: (level: string, message: string) => {
    console.log(`[Socket.IO ${level}] ${message}`);
  },
});

app.use('/uploads', express.static('uploads'));
/***** 미들웨어 *****/
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: {
      policy: 'same-origin-allow-popups',
    },
    referrerPolicy: {
      policy: ['no-referrer-when-downgrade'],
    },
    xssFilter: true,
  })
);
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    // origin: true,
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
      'Authorization',
      'Code',
    ],
  })
);

// post 요청 시 값을 객체로 바꿔줌
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/***** 라우팅 *****/
app.use('', routes);

/***** 프론트(리액트)와 연결 *****/
app.set('view engine', 'html');
// io.js 파일이 TypeScript로 변환되지 않았으므로 require 사용
const io = require('./util/io.js');
io(socketIO); //매개변수로 io를 넘겨줌

httpServer.listen(8082, function () {
  console.log('listening on 8082');
});

export default socketIO;

