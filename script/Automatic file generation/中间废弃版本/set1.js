const fs = require('fs')
const path = require('path');
const dayjs = require('./dayjs.min.js')
// let basepath = path.resolve(__dirname, 'src/views/account/')
let basepath = path.resolve(__dirname, 'account')
// 获取命令行参数
const paths = process.argv || []
const catalogue = paths[2] || 'account'
console.warn(catalogue)
const file = []
const arrs = [
    // 'demo',
    // 'set',
    // 'login',
    // 'abc',
    // 'abcd'
]

const resolve = (...val) => {
    return path.resolve(__dirname, catalogue, ...val)
}

let reads = [path.resolve(__dirname, 'template.js'), path.resolve(__dirname, 'template.module.less')];//要读取的文件

let readFile = function (item) {
    return new Promise((res) => {
        for (let a of reads) {
            let text = fs.readFileSync(a).toString();
            text = text.replace(/time/g, dayjs().format('YYYY/MM/DD'))
                .replace(/name/g, 'Yang XuSheng').replace(/styleName/g, item);
            file.push(text)
        }
        res(file);
    })
}

let writes = ['index.tsx', 'index.module.less'];

let writeFile = function (file, item) {
    return new Promise((res, rej) => {
        (async function () {
            for (let a of writes) {
                await fs.writeFile(resolve(item, a),
                    a == writes[0] ? file[0] : a == writes[1] ? file[1] : '', (err) => {
                        if (err) rej(err)
                    })
            }
            res('succ');
        })()
    })
}

const mkdir = function (item) {
    return new Promise((res, rej) => {
        fs.mkdir(resolve(item), async (err) => {
            if (err) rej(err);
            try {
                await writeFile(await readFile(item), item)
            } catch(err) {
                console.error(err)
            }
        });
    })
}

const exists = function (arrs = []) {
    console.warn(dayjs().format('YYYY/MM/DD'))
    return new Promise((res) => {
        if (!arrs.length) {
            paths.forEach(async (item, index) => {
                if (index < 3) return;
                fs.existsSync(resolve(item)) ? basepath = resolve(item) : await mkdir(item);
            })
            res(basepath);
        } else {
            arrs.forEach(async item => {
                fs.existsSync(resolve(item)) ? basepath = resolve(item) : await mkdir(item);
            })
            res(basepath);
        }
    })
}

async function creatFile() {
    try {
        // 先判断目录是否存在，不存在就创建
        // await exists([catalogue]);
        await exists(arrs);
    } catch(err) {
        console.error(err)
    }
}

creatFile()