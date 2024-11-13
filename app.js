const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// 图片路径和压缩后的路径

let sourceDir = fs.readdirSync(path.resolve(__dirname, "uploads"));

function imgPress(item) {
    return new Promise((resolve, reject) => {
        let imgSourcePath = path.resolve(__dirname, `uploads/${item}`);
        let imgDistPath = path.resolve(__dirname, `dist/${item}`);
        const extName = path.extname(imgSourcePath)?.substring(1);

        // 压缩图片
        sharp(imgSourcePath)
            .toFormat(extName, { quality: 50, progressive: true }) // 设置压缩质量，1-100
            .toFile(imgDistPath, (err, info) => {
                if (err) {
                    console.error("An error occurred:", err);
                    reject(false);
                    return;
                }
                // if (item.match(/8/)) {
                //     reject(false);
                //     return;
                // }
                resolve(true);
                // console.log("Image compressed successfully.");
            });
    });
}

imgHandler(sourceDir, 3).then((rsp) => {
    let failResult = [];
    rsp.map((item) => {
        if (item === true) {
            return true;
        } else {
            failResult.push(item);
            return false;
        }
    });
    if (failResult.length === 0) {
        console.log("全部压缩成功！！！");
    } else {
        console.log("部分压缩成功！！！\n失败列表：\n", failResult.join("\n"));
    }
});
/**
 * 压缩图片并发处理
 * @param {*} sourceDir 图片列表
 * @param {*} num 最大并发数量
 * @returns
 */
function imgHandler(sourceDir, num = 5) {
    return new Promise((resolve) => {
        if (sourceDir.length === 0) {
            resolve([]);
            return;
        }
        let nextIndex = 0; // 下一次处理下标
        const result = []; // 存放处理结果
        let count = 0; // 当前已完成的数量
        async function singleHandler() {
            const i = nextIndex;
            let imgName = sourceDir[i];
            nextIndex++;
            try {
                const resp = await imgPress(imgName);
                result[i] = resp;
            } catch (e) {
                result[i] = imgName;
            }

            if (nextIndex < sourceDir.length) {
                singleHandler();
            }
            count++;
            if (count === sourceDir.length) {
                resolve(result);
            }
        }
        for (let i = 0; i < Math.min(sourceDir.length, num); i++) {
            singleHandler();
        }
    });
}
