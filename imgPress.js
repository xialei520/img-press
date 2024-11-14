const sharp = require("sharp");

const path = require("path");
const fs = require("fs");
const { getFilePath } = require("./utils/index");

function imgPress(item, uploadDir) {
    return new Promise((resolve, reject) => {
        let dir = getFilePath({ rootName: "dest", uploadDir });
        // 确保目录存在
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        let imgSourcePath = getFilePath({ uploadDir, fileName: item });
        let imgDistPath = getFilePath({ rootName: "dest", uploadDir, fileName: item });
        const extName = path.extname(imgSourcePath)?.substring(1);

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
