const os = require("os");
const path = require("path");
const fs = require("fs");
const { rimrafSync } = require("rimraf");

function getLocalIp() {
    const networkInterfaces = os.networkInterfaces();

    let ip = "";
    Object.values(networkInterfaces).forEach((list) => {
        list.forEach((ipInfo) => {
            if (ipInfo.family === "IPv4" && ipInfo.address !== "127.0.0.1" && !ipInfo.internal) {
                ip = ipInfo.address;
            }
        });
    });
    return ip;
}

function mkdir(filePath) {
    if (!filePath) return;

    let arr = [];
    while (!fs.existsSync(filePath)) {
        arr.push(filePath);
        filePath = path.dirname(filePath);
    }

    for (let i = arr.length - 1; i >= 0; i--) {
        fs.mkdirSync(arr[i]);
    }
}
// 获取当前日期
function getDate() {
    let years = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    return `${years}${month}${day}`;
    // return Date.now();
}
// 获取文件路径
function getFilePath({ rootName = "uploads", uploadDir, fileName }) {
    if (fileName) {
        return path.resolve(process.cwd(), `${rootName}/images/${uploadDir}/${fileName}`);
    } else {
        return path.resolve(process.cwd(), `${rootName}/images/${uploadDir}`);
    }
}

// 定时任务，定时删除文件
function timeTask() {
    setInterval(() => {
        let uploadImgDir = path.resolve(process.cwd(), "uploads/images");
        let destImgDir = path.resolve(process.cwd(), "dest/images");
        let uploadsArr = fs.readdirSync(uploadImgDir);

        uploadsArr.forEach((item) => {
            let uploadPath = path.resolve(uploadImgDir, item);
            let destPath = path.resolve(destImgDir, item);
            const { ctimeMs } = fs.statSync(uploadPath);

            let result = isTimestampOlderThan10Minutes(ctimeMs);
            if (result) {
                console.log("时间戳距离现在超过10分钟。");
                rimrafSync(uploadPath);
                rimrafSync(destPath);
            } else {
                console.log("时间戳距离现在未超过10分钟。");
            }
        });
    }, 10 * 60 * 1000);
}

function isTimestampOlderThan10Minutes(timestamp) {
    const tenMinutesInMilliseconds = 10 * 60 * 1000; // 10分钟转换为毫秒
    const currentTime = Date.now(); // 获取当前时间戳（毫秒）

    return currentTime - timestamp > tenMinutesInMilliseconds; // 判断时间差
}

exports.ip = getLocalIp();
exports.mkdir = mkdir;
exports.getDate = getDate;
exports.getFilePath = getFilePath;
exports.timeTask = timeTask;
