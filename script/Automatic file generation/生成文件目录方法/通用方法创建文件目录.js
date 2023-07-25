let fs = require("fs");  
let path = require("path");  
// 需要npm 安装async 库
let async = require("async");

/**
 *生成多层目录
 * @param dir 多层目录
 * @param split 分隔符，ex:'/' 对应的目录地址:'2015/10/10'
 * @param mode 目录权限（读写权限），默认0777
 * @param callback
 */
 let createDirsSync = function (dir, split, mode, callback) {
    console.log("创建目录：" + dir);
    if (!fs.existsSync(dir)) {
        let dirArr = dir.split(split);
        let pathtmp;
        async.forEach(dirArr, function (item, cb) {
            console.log( item);
            if (pathtmp) {
                pathtmp = path.join(pathtmp, item);
            }
            else {
                pathtmp = item;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    cb(null, item);
                }
                else {
                }
            }
        }, function (err) {
            callback(err);
        })
    }
    else {
        callback(null);
    }
}

createDirsSync('./aa/bb/cc')