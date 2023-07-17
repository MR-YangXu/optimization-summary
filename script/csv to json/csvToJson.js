const fs = require('fs')

const dirs = fs.readdirSync('./static')

dirs.filter(dir => /\.csv$/.test(dir)).forEach(fileName => {
    const file = fs.readFileSync(`./static/${fileName}`)
    // 增加之后，中文不会出现乱码情况
    const getUTF8 = new TextDecoder('utf-8').decode(file).split('\r\n')
    // 获取表头, 用于组装数据
    const headList = getUTF8[0].split(',')
    const headLen = headList.length
    const UTF8Len = getUTF8.length
    const arrs = []
    // 遍历文件, 注意是从 i = 1 开始, 因为不需要表头
    for (let i = 1; i < UTF8Len; i++) {
        const UTF8Item = getUTF8[i] || ''
        const childList = UTF8Item.split(',')
        if (childList.length === 1) break // 说明该数据是空数据格式
        const obj = {}
        // 遍历表头数组
        for (let j = 0; j < headLen; j++) {
            const headItem = headList[j]
            obj[headItem] = childList[j]
        }
        arrs.push(obj)
    }

    const excludes = ['990000'];
    const countys = []
    const areaData = arrs.reduce((pre, next) => {
        if (excludes.includes(next.XZQHDAIM)) {
            return pre
        }
        const arr = next.XZHQHMCH.split('-')
        if (arr.length === 3) {
            pre.county_list[next.XZQHDAIM] = arr[2]
            // 存储区对应的市代码
            const code = next.SUOZAISF.slice(0, 4)
            if (!countys.includes(code)) {
                countys.push(code)
            }
        } else if (arr.length === 2) {
            if (arr[1].includes('市辖')) {
                pre.city_list[next.XZQHDAIM] = arr[0]
            } else {
                pre.city_list[next.XZQHDAIM] = arr[1]
            }
        } else if (arr.length === 1) {
            pre.province_list[next.XZQHDAIM] = arr[0]
        } 
        return pre
    }, {
        province_list: {},
        city_list: {},
        county_list: {}
    })
    // 补齐有市没区的城市
    for (let [key, value] of Object.entries(areaData.city_list)) {
        if (!countys.includes(key.slice(0, 4))) {
            areaData.county_list[key] = value
        }
    }
    // 得到不需要文件后缀的名称
    const getFile = fileName.split('.')[0]
    // 写入文件数据
    fs.writeFileSync(`./${getFile}.json`, JSON.stringify(areaData, null, 2))
})