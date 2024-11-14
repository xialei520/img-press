const { imgPress } = require("../imgPress");
const { ip, mkdir, getDate, getFilePath } = require("../utils/index");
const fs = require("fs");

const port = 8080,
    host = ip;
module.exports = async function (ctx, next) {
    let fileName = ctx.req.file.filename;
    // console.log("日志输出", ctx.req.body.randomNum);
    let uploadDir = ctx.req.headers.randomnum || "general";
    try {
        await imgPress(fileName, uploadDir);
        const filePath = getFilePath({ rootName: "dest", uploadDir, fileName });

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
                    downloadPath: `http://${host}:${port}/images/${uploadDir}-${getDate()}/${fileName}`
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
};
