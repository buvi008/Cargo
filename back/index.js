const compression = require('compression');
require('dotenv').config();
const express = require('express');
const app = express();
const path = require("path");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
const http = require('http');

const dbConnect = require('./middlewares/dbConnect');

const editUser = require('./routes/editUser');
const clientRouter = require('./routes/client');
const shopRouter = require('./routes/shop');
const orderRouter = require('./routes/order');

const auditLogs = require('./helpers/auditLogs')

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
// WS
const wss = new WebSocket.Server({ noServer: true });

app.use(function (req, res, next) {
  req.wss = wss;
  next();
});

server.on('upgrade', function upgrade(request, socket, head) {
  // This function is not defined on purpose. Implement it with your own logic.
    // if (err || !client) {
    //   socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    //   socket.destroy();
    //   return;
    // }
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
});

// 

app.use(compression());
app.use(cors())
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit:50000 }));

app.use('/*', auditLogs)

app.use('/', editUser);
app.use('/client', clientRouter);
app.use('/shop', shopRouter);
app.use('/order', orderRouter);

app.get('/*', (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})


function start() {
  try {
    dbConnect();
    server.listen(PORT, () => {
      console.log('Server Start, PORT: '+PORT);
    })
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}

start();
