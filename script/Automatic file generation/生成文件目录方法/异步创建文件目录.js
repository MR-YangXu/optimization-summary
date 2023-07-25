let fs = require("fs");  
let path = require("path");  

//递归创建目录 异步方法  
function mkdirs(dirname, callback) {  
    fs.exists(dirname, function (exists) {  
        if (exists) {  
            callback();  
        } else {  
            //console.log(path.dirname(dirname));  
            mkdirs(path.dirname(dirname), function () {  
                fs.mkdir(dirname, callback);  
            });  
        }  
    });  
}

//调用 
mkdirs("./aa/bb/cc/dd", function (ee) {  
   console.log(ee)  
});