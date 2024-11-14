const fs = require("fs");
const path = require("path");
const { zipFile } = require("../utils/archiver");
const { ip, mkdir, getDate, getFilePath } = require("../utils/index");
const port = 8080,
    host = ip;
module.exports = async function (ctx, next) {
    let randomNum = ctx.request.body.randomNum;
    if (randomNum) {
        let destDir = fs.readdirSync(path.resolve(process.cwd(), "dest/images"));

        let dirName = "";
        destDir.forEach((dir) => {
            if (dir.indexOf(randomNum) > -1) {
                dirName = dir;
            }
        });
        let pressDir = path.resolve(process.cwd(), `dest/images/${dirName}`);
        try {
            await zipFile(pressDir)
                .then(() => {
                    console.log("ZIP 文件创建成功!");
                })
                .catch((error) => {
                    console.error("压缩过程中出错:", error);
                });
            ctx.body = {
                code: 200,
                message: "File press successfully!",
                data: {
                    url: `http://${host}:${port}/images/${dirName}/source.zip`
                }
            };
        } catch (e) {
            ctx.body = {
                code: 201,
                message: e.message || "server error",
                data: null
            };
        }
    } else {
    }

    await next();
};
