const path = require("path");
const fs = require("fs");
const Koa = require("koa");
const { ip, mkdir, getDate, getFilePath, timeTask } = require("./utils/index");
const app = new Koa();
const static = require("koa-static");

const bodyParser = require("koa-bodyparser");

const Router = require("koa-router");
const router = new Router();

const { zipFile } = require("./utils/archiver");
const urlRouter = require("./router");

const port = 8080,
    host = ip;

// 执行定时删除任务
timeTask();

app.use(async (ctx, next) => {
    if (ctx.request.url === "/") {
        ctx.redirect("/index.html");
        // ctx.body = htmlContent;
    }
    await next(); // 必须加await， 否则接口报404
});

//设置静态资源目录
app.use(static(path.resolve("dest")));
app.use(bodyParser());

urlRouter(router);
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, host, () => {
    console.log(`server is running at http://${host}:${port}`);
});
