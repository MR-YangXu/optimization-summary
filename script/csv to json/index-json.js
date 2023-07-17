const fs = require('fs')

const dirs = fs.readdirSync('./static')

dirs.filter(dir => /\.csv$/.test(dir)).forEach(fileName => {
    const file = fs.readFileSync(`./static/${fileName}`)
    const getUTF8 = new TextDecoder('utf-8').decode(file).split('\r\n')
    console.warn(getUTF8, 'getUTF8')
    // 获取表头, 用于组装数据
    const headList = getUTF8[0].split(',')
    const headLen = headList.length
    const gbkLen = getUTF8.length
    const json = []
    // 遍历文件, 注意是从 i = 1 开始, 因为不需要表头
    for (let i = 1; i < gbkLen; i++) {
        const gbkItem = getUTF8[i]
        const childList = gbkItem.split(',')
        if (childList.length === 1) break // 说明该数据是空数据格式
        const obj = {}
        // 遍历表头数组
        for (let j = 0; j < headLen; j++) {
            const headItem = headList[j]
            obj[headItem] = childList[j]
        }
        json.push(obj)
    }
    // 得到不需要文件后缀的名称
    const getFile = fileName.split('.')[0]
    // 写入文件数据
    fs.writeFileSync(`./file/${getFile}.json`, JSON.stringify(json))
})