const main = require('../controllers/main');
module.exports = router => {
  router.get('/', ctx => {
    ctx.body = { "status": true, "message": "working..." }
  }).post('/api/wallet/new', async ctx => {
    await main.newWallet(ctx);
  }).post('/api/wallet/private-key', async ctx => {
    await main.privateKey(ctx);
  });
}

