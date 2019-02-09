const fs = require('fs');
const outputStream = fs.createWriteStream('./output.txt');

module.export = (value) => {
    outputStream.write(`${value}\n`);
}