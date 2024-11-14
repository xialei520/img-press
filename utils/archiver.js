//archiver是一个在nodejs中能跨平台实现打包功能的模块，可以打zip和tar包，是一个比较好用的三方模块。
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const { rimrafSync } = require("rimraf"); //rimraf 包的作用：以包的形式包装rm -rf命令，用来删除文件和文件夹的，不管文件夹是否为空，都可删除.

async function zipFile(input) {
    //创建输出流
    console.log("日志输出zipFile", input);
    const sourceDir = path.join(input); // 源文件夹
    const outputZipPath = path.join(sourceDir, "source.zip"); // 输出的ZIP文件路径
    if (fs.existsSync(outputZipPath)) {
        rimrafSync(outputZipPath);
    }
    const output = fs.createWriteStream(outputZipPath);
    //生成archiver对象，打包类型为zip
    let archive = archiver("zip", {
        zlib: { level: 9 } //压缩等级
        // comment: "123456789",
        // forceZip64: true
    });
    return new Promise((resolve, reject) => {
        output.on("close", function () {
            let size = archive.pointer() / 1000;
            size = size > 1000 ? (size / 1000).toFixed(2) + "MB" : parseInt(size);
            console.log("example.zip: " + size);
            resolve();
        });

        output.on("end", function () {
            console.log("Data has been drained");
        });

        archive.on("error", function (err) {
            reject(err);
        });

        //将打包对象与输出流关联
        archive.pipe(output);

        //将被打包文件的流添加进archiver对象中
        // archive.append(fs.createReadStream(file1), { name: 'app.js' });

        //打包文件夹, 并命名
        archive.directory(sourceDir, false);

        archive.finalize();
    });
}

exports.zipFile = zipFile;
