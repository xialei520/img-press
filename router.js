const downloadController = require("./controller/download");
const uploadController = require("./controller/upload");
const multer = require("koa-multer");
const { ip, mkdir, getDate, getFilePath } = require("./utils/index");
const { getFileName } = require("./utils/fileName");
module.exports = function (router) {
    // 设置 multer 存储选项
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            let uploadDir = req.headers.randomnum || "general";
            const dir = getFilePath({ uploadDir }); // 上传目录
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
    router.post("/download", downloadController);
    router.post("/upload", upload.single("file"), uploadController);
};
