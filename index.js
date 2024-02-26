const Koa = require('koa')
const json = require('koa-json')
const Router = require('koa-router')
const koaBody = require('koa-body')
const compress = require('koa-compress');
const serveStatic = require('koa-static');
const app = new Koa()
const router = new Router()
const Env = require("./config/env");

app.use(compress({
  filter(content_type) {
    return /text/i.test(content_type)
  },
  threshold: 2048,
  gzip: {
    flush: require('zlib').constants.Z_SYNC_FLUSH
  },
  deflate: {
    flush: require('zlib').constants.Z_SYNC_FLUSH,
  },
  br: false
}))
app.use(serveStatic(__dirname + '/files'));
app.use(koaBody({ multipart: true }));
app.use(json())
require('./modules/routers/api.router')(router);
app.use(router.routes())
app.listen(Env.PORT, () => { console.log("working in port: " + Env.PORT) })
