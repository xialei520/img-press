const fs = require("fs");
const path = require("path");

function getFileName(fileName) {
    const filePath = path.join(process.cwd(), `uploads/${fileName}`);

    if (fs.existsSync(filePath)) {
        const result = fileName.match(/(?<=.*\_)\d+(?=\.)/);

        if (result) {
            fileName = fileName.replace(/(?<=.*\_)\d+(?=\.)/, +result[0] + 1);
        } else {
            fileName = fileName.replace(/(\.)/, "_1$1");
        }
        return getFileName(fileName);
    } else {
        return fileName;
    }
}
exports.getFileName = getFileName;
