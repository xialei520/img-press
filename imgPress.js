const sharp = require("sharp");

const path = require("path");
const fs = require("fs");

function imgPress(item) {
    return new Promise((resolve, reject) => {
        let dir = path.resolve(process.cwd(), `dest/images`);
        // 确保目录存在
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        let imgSourcePath = path.resolve(process.cwd(), `uploads/images/${item}`);
        let imgDistPath = path.resolve(process.cwd(), `dest/images/${item}`);
        const extName = path.extname(imgSourcePath)?.substring(1);

        console.log("日志输出", imgSourcePath, extName, imgDistPath);
        // 压缩图片
        sharp(imgSourcePath)
            .toFormat(extName, { quality: 50 }) // 设置压缩质量，1-100
            .toFile(imgDistPath, (err, info) => {
                if (err) {
                    console.error("An error occurred:", err);
                    reject(false);
                    return;
                }

                resolve(true);
            });
    });
}

exports.imgPress = imgPress;
