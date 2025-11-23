require('dotenv').config();
require('dotenv').config({ path: '.env.development' });
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');
const routes = require('./routes');

let sess = {
  genid: (req) => {
    return uuidv4(); // use UUIDs for session IDs
  },
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {},
  store: new MemoryStore({
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
  logger: (level, message) => {
    console.log(`[Socket.IO ${level}] ${message}`);
  },
});

app.use('/uploads', express.static('uploads'));
/***** 미들웨어 *****/
app.use((req, res, next) => {
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
require('./util/io.js')(socketIO); //매개변수로 io를 넘겨줌

httpServer.listen(8082, function () {
  console.log('listening on 8082');
});

module.exports = socketIO;
