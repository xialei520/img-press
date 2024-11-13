const os = require("os");
const path = require("path");
const fs = require("fs");

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
    const separator = path.sep;
    let arr = filePath.split(separator);
    let pathStr = "";
    for (let i = 0; i < arr.length; i++) {
        pathStr += `${pathStr === "" ? "" : separator}${arr[i]}`;

        if (!fs.existsSync(pathStr)) {
            fs.mkdirSync(pathStr);
        }
    }
}

exports.ip = getLocalIp();
exports.mkdir = mkdir;
