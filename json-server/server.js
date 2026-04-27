const http = require('http');
const jsonServer = require('json-server');
const { WebSocketServer } = require('ws');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = jsonServer.create();
const router = jsonServer.router('config.json');
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use(jsonServer.bodyParser);

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const ORDER_EVENT_BY_METHOD = {
  POST: 'order:created',
  PUT: 'order:updated',
  PATCH: 'order:updated',
  DELETE: 'order:deleted',
};

const originalRender = router.render;
router.render = (req, res) => {
  if (WRITE_METHODS.has(req.method) && req.url.startsWith('/orders')) {
    const type = ORDER_EVENT_BY_METHOD[req.method];
    broadcast({ type, payload: res.locals.data });
  }
  if (originalRender) {
    originalRender(req, res);
  } else {
    res.jsonp(res.locals.data);
  }
};

app.use(router);

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

function broadcast(message) {
  const data = JSON.stringify(message);
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(data);
  }
}

wss.on('connection', (socket) => {
  console.log('[ws] client connected — total:', wss.clients.size);
  socket.on('close', () =>
    console.log('[ws] client disconnected — total:', wss.clients.size),
  );
});

server.listen(PORT, HOST, () => {
  console.log(`json-server + ws listening on http://${HOST}:${PORT}`);
  console.log(`websocket path: ws://${HOST}:${PORT}/ws`);
});
