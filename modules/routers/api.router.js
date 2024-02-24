const main = require('../controllers/main');

const routes = [
  { method: 'get', path: '/', handler: ctx => { ctx.body = { "status": true, "message": "working..." } } },
  { method: 'post', path: '/api/wallet/new', handler: main.newWallet },
  { method: 'post', path: '/api/wallet/private-key', handler: main.privateKey },
  { method: 'post', path: '/api/wallet/add-token', handler: main.addTokenToWallet },
  { method: 'post', path: '/api/wallet/send-transaction', handler: main.sendTransaction }
];

module.exports = router => {
  routes.forEach(({ method, path, handler }) => {
    router[method](path, async ctx => {
      return handler(ctx);
    });
  });
};
