const fs = require('fs')
const path = require('path');
const dayjs = require('./dayjs.min.js')
// 获取命令行参数
const paths = process.argv || []
// 文件目录
const catalogue = paths[2] || 'account'
let file = []
// 需要生成的文件
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
        file = []
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
    return new Promise(async (res, rej) => {
        for (let a of writes) {
            await fs.writeFile(resolve(item, a), a == writes[0] ? file[0] : a == writes[1] ? file[1] : '', (err) => {
                if (err) rej(err)
            })
        }
        res('succ');
    })
}

const mkdir = function (item = '', root) {
    return new Promise((res, rej) => {
        fs.mkdir(resolve(item), async (err) => {
            console.warn(err)
            if (err) rej(err);
            try {
                if (root) {
                    return res('succ')
                }
                const file = await readFile(item)
                await writeFile(file, item)
                res('succ')
            } catch(err) {
                rej(err)
                console.error(err)
            }
        });
    })
}

const exists = function (arrs = [], root) {
    return new Promise(async (res, rej) => {
        try {
            if (root) {
                paths.forEach(async (item, index) => {
                    if (index < 2) return;
                    !fs.existsSync(resolve()) && await mkdir('', root)
                })
                return res()
            }
            if (!arrs.length) {
                paths.forEach(async (item, index) => {
                    if (index < 3) return;
                    !fs.existsSync(resolve(item)) && await mkdir(item);
                })
            } else {
                arrs.forEach(async item => {
                    !fs.existsSync(resolve(item)) && await mkdir(item);
                })
            }
            res('succ');
        } catch(err) {
            rej(err)
        }
    })
}

async function creatFile() {
    try {
        // 先判断目录是否存在，不存在就创建
        await exists([], true);
        // await exists(arrs);
    } catch(err) {
        console.error(err)
    }
}

creatFile()