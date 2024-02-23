const main = require('../controllers/main');
module.exports = router => {
  router.get('/', ctx => {
    ctx.body = { "status": true, "message": "working..." }
  }).get('/api/new-wallet', async ctx => {
    await main.newWallet(ctx);
  });
}

