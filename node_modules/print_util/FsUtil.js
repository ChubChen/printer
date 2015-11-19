var fs = require('fs');
var path = require('path');

var fsUtil = function(){
}

fsUtil.prototype.createDirSync = function (dirname, mode) {
    var self = this;
    console.log(dirname);
    if(fs.existsSync(dirname)){
        return true;
    }else {
        if (self.createDirSync(path.dirname(dirname), mode)) {
            fs.mkdirSync(dirname, mode);
            return true;
        }
    }
    return false;
}

module.exports = new fsUtil();