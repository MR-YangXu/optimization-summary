const fs = require('fs')
const path = require("path");
const dayjs = require('dayjs')
// let basepath = path.resolve(__dirname, "src/views/account/")
let basepath = path.resolve(__dirname, "account")
// 获取命令行参数
const paths = process.argv
const name = 'demo'
const file = []

const resolve = (val) => {
    return path.resolve(__dirname, 'account', val)
}

const mkdir = function (item) {
    return new Promise((res, rej) => {
        fs.mkdir(resolve(item), (err) => {
            if (err) rej(err);
            basepath = resolve(item)
            res(basepath);
        });
    })
}

const exists = function () {
    return new Promise((res) => {
        paths.forEach(async (item, index) => {
            if (index < 2) return;
            fs.existsSync(resolve(item)) ? basepath = resolve(item) : await mkdir(item);
        })
        res(basepath);
    })
}

let reads = [path.resolve(__dirname, 'template.js'), path.resolve(__dirname, 'template.js')];//要读取的文件

let readFile = function () {
    return new Promise((res) => {
        for (let a of reads) {
            let text = fs.readFileSync(a).toString();
            text = text.replace(/time/g, dayjs().format('YYYY/MM/DD'))
                .replace(/temp/g, name);
            console.warn(text)
            file.push(text)
        }
        res(file);
    })
}

let writes = [`${name}.js`, `${name}.html`, `${name}.less`, `index.js`];

let writeFile = function (file) {
    return new Promise((res, rej) => {
        (async function () {
            for (let a of writes) {
                await fs.writeFile(resolve(a),
                    a == writes[3] ? file[0] : a == writes[0] ? file[1] : '', (err) => {
                        if (err) rej(err)
                    })
            }
            res('succ');
        })()
    })
}

async function creatCpt() {
    try {
        await exists(); // 检测文件夹
        await readFile(); // 读取模板内容
        await writeFile(await readFile()); //写入组件
    }
    catch (err) {
        console.error(err);
    }
}

creatCpt();