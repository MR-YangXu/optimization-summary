const fs = require('fs')
const XLSX = require('xlsx');

const dirs = fs.readdirSync('./static')
dirs.filter(dir => /\.xls$/.test(dir)).forEach(fileName => {
    // 读取 Excel 文件
    const workbook = XLSX.readFile(`./static/${fileName}`);
    
    // 获取 Excel 文件中的第一个工作表
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // 将工作表转换为 JSON 对象
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // 打印 JSON 对象
    console.log(jsonData);

    const excludes = ['990000'];
    const countys = []
    const areaData = jsonData.reduce((pre, next) => {
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