const path = require("path");
const fs = require("fs");
const Koa = require("koa");
const { ip, mkdir } = require("./utils/index");
const app = new Koa();
const static = require("koa-static");
const { koaBody } = require("koa-body");
const multer = require("koa-multer");
const Router = require("koa-router");
const router = new Router();
const { imgPress } = require("./imgPress");
const { getFileName } = require("./utils/fileName");

const port = 8080,
    host = ip;

app.use(async (ctx, next) => {
    if (ctx.request.url === "/") {
        ctx.redirect("/index.html");
        // ctx.body = htmlContent;
    }
    await next(); // 必须加await， 否则接口报404
});

// 设置 multer 存储选项
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, "uploads/images"); // 上传目录
        mkdir(dir);

        cb(null, dir); // 设置文件存储的目录
    },
    filename: (req, file, cb) => {
        // 设置文件名，这里使用原始文件名
        let fileName = file.originalname;
        fileName = getFileName(fileName);

        cb(null, fileName); // 添加时间戳以避免名称冲突
    }
});

// 创建 multer 实例
const upload = multer({ storage });
// upload.single("file"),
// 配置路由
router.post("/upload", upload.single("file"), async (ctx, next) => {
    // file 是前端传来的文件字段名
    // ctx.response

    let fileName = ctx.req.file.filename;
    try {
        await imgPress(fileName);
        const filePath = path.join(process.cwd(), `dest/images/${fileName}`);

        // 异步读取文件信息
        const statInfo = fs.statSync(filePath);

        ctx.body = {
            code: 200,
            message: "File press successfully!",
            data: {
                file: ctx.req.file, // 文件的保存路径
                imgInfo: {
                    size: statInfo.size,
                    ctime: statInfo.ctime,
                    mtime: statInfo.mtime,
                    downloadPath: `http://${host}:${port}/images/${fileName}`
                }
            }
        };
    } catch (e) {
        ctx.body = {
            code: 201,
            message: e.message || "server error",
            data: null
        };
    }

    await next();
});

//设置静态资源目录
app.use(static(path.resolve("dest")));
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, host, () => {
    console.log(`server is running at http://${host}:${port}`);
});
