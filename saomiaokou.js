/**
 * Created by CH on 15-3-23.
 */
var saomiao = function () {
    var self = this;
    var ticktes = [
        {
            gameCode: 'T51', pType: '03', bType: '31', amount: 200,
            multiple: 99, outerId: "123",
            number: '02|201503227006|11,01,30,41,09;02|201503226007|33,32,12,01;02|201503227005|02,31,33'
        }
    ];
    this.ticket = ticktes;
    self.weekConf = [
        {"1": 1, "2": 2, "3": 4, "4": 8},
        {"5": 1, "6": 2, "7": 4}
    ];
    self.weekRow = 2;
    self.zongJinQiu = [
        {"0": 1, "1": 2, "2": 4, "3": 8},
        {"4": 1, "5": 2, "6": 4, "7": 8}
    ];
    self.zongJinQiuRow = 2;
    self.halfConf = [
        {"33": 1, "31": 2, "30": 4 },
        {"13": 1, "11": 2, "10": 4},
        {"03": 1, "01": 2, "00": 4}
    ];
    self.halfRow = 3;
    self.winConf = [
        {"3": 1, "1": 2, "0": 4}
    ];
    self.winRow = 1;
    self.scoreConf = [
        {"10": 1, "42": 2, "24": 4, "01": 8},
        {"20": 1, "50": 2, "05": 4, "02": 8},
        {"21": 1, "51": 2, "15": 4, "12": 8},
        {"30": 1, "52": 2, "25": 4, "03": 8},
        {"31": 1, "90": 2, "09": 4, "13": 8},
        {"32": 1, "00": 2, "33": 4, "23": 8},
        {"40": 1, "11": 2, "99": 4, "04": 8},
        {"41": 1, "22": 2, "14": 8}
    ];
    self.scoreRow = 8;
    self.shunXuArray = [1,0,0,3];



};
saomiao.prototype.start = function (ticket) {
    var self = this;
    self.weekConf = [
        {"1": 1, "2": 2, "3": 4, "4": 8},
        {"5": 1, "6": 2, "7": 4}
    ];
    self.weekRow = 2;
    self.zongJinQiu = [
        {"0": 1, "1": 2, "2": 4, "3": 8},
        {"4": 1, "5": 2, "6": 4, "7": 8}
    ];
    self.zongJinQiuRow = 2;
    self.halfConf = [
        {"33": 1, "31": 2, "30": 4 },
        {"13": 1, "11": 2, "10": 4},
        {"03": 1, "01": 2, "00": 4}
    ];
    self.halfRow = 3;
    self.winConf = [
        {"3": 1, "1": 2, "0": 4}
    ];
    self.winRow = 1;
    self.scoreConf = [
        {"10": 1, "42": 2, "24": 4, "01": 8},
        {"20": 1, "50": 2, "05": 4, "02": 8},
        {"21": 1, "51": 2, "15": 4, "12": 8},
        {"30": 1, "52": 2, "25": 4, "03": 8},
        {"31": 1, "90": 2, "09": 4, "13": 8},
        {"32": 1, "00": 2, "33": 4, "23": 8},
        {"40": 1, "11": 2, "99": 4, "04": 8},
        {"41": 1, "22": 2, "14": 8}
    ];
    self.scoreRow = 8;


    var numberArray = ticket.number.split(";");
    var weekDay = new Array();
    var matchArray = new Array();
    var resultArray = new Array();
    for (var i = 0; i < numberArray.length; i++) {
        var temp = numberArray[i].split("|");
        weekDay.push(temp[1].substr(temp[1].length - 4, 1));
        matchArray.push(temp[1].substr(temp[1].length - 3));
        resultArray.push(temp[2]);
    }
    //组装
    var str = "01 1c 00 0d 00 0e 00 31 07 ";
    str += self.trans(self.weekConf, self.weekRow, weekDay) + self.changciTrans(matchArray);
    if (ticket.pType == "01" || ticket.pType == "02") { //胜平负
        str += self.trans(self.winConf, self.winRow, resultArray);
    }
    else if (ticket.pType == "04") {//总进球
        str += self.trans(self.zongJinQiu, self.zongJinQiuRow, resultArray);
    }
    else if (ticket.pType == "05") {//半全场
        str += self.trans(self.halfConf, self.halfRow, resultArray);
    }
    else if (ticket.pType == "03") {//半全场
        str += self.trans(self.scoreConf, self.scoreRow, resultArray);
    }
    str += self.btypeTrans(ticket.bType, ticket.multiple);
    console.log(str);
};
//
saomiao.prototype.trans = function(confObj, row, array){
    var self = this;
    var resultArray = new Array();
   resultArray.push("00 00 ");
   for(var i = 0; i < row ; i++){
       var bool = true;
       for(var j = 0; j< 3; j++){
           if(j == 2 && bool ){
               bool = false;
               j--;
               resultArray.push(" 0");
               continue;
           }
           var result = 0;
           if(array[self.shunXuArray[j]]){
               var tempArray = array[self.shunXuArray[j]].split(',');
               for(var k = 0 ;k < tempArray.length; k++){
                   if(confObj[i][tempArray[k]]){
                       result += confObj[i][tempArray[k]];
                   }
               }
           }
           resultArray.push(result);
       }
       resultArray.push(" ");
   }
   console.log(resultArray.join(""));
   return resultArray.join("");
}

saomiao.prototype.changciTrans = function (match) {
    var Obj = {"0": "0", "1": "1", "2": "2", 3: "3", "4": "4", "5": "8", "6": "6", "7": "a", "8": "b", "9": "c"};
    var weekArray = new Array();
    for (var i = 0; i < 3; i++) {
        var bool = true;
        for (var j = 0; j < 3; j++) {
            if (j == 2 && bool) {
                bool = false;
                j--;
                weekArray.push(" 0");
                continue;
            }
            var tempArray = [0,0,0];
            if(match[self.shunXuArray[j]]){
                 tempArray = match[self.shunXuArray[j]].toString().split("").reverse();
            }
            weekArray.push(Obj[tempArray[i]]);
        }
        weekArray.push(" ");
    }
    return weekArray.join("");
};

saomiao.prototype.btypeTrans =  function(bType, multiple){
    var self = this;
    var resultArray = new Array();
    var betTypeConf = [[{"21":"1","31":"2","33":"4","34":"8","41":"1","44":"2","45":"4","46":"8","71":"1","77":"2","78":"4","721":"8"},{"735":"1","7120":"2","411":"1","11":"8"}],[{"51":"1","55":"2","56":"4","510":"8","81":"1","88":"2","89":"4","828":"8"},{"516":"1","520":"2","526":"4","856":"1","870":"2","8247":"4"}],[{"61":"1","66":"2","67":"4","615":"8"},{"620":"1","622":"2","635":"4","642":"8"}],[{"650":"1","657":"2"},{}]];
    var multiplePeizhi = {"0":"0","1":"1","2":"2","3":"4","4":"8","5":"6","6":"7","7":"b","8":"c","9":"e","10":"f"};
    var tenMultiple= {"0":"0","1":"2","2":"4","3":"8","4":"a","5":"b","6":"d"};
    resultArray.push("00 00 ");
    for(var i = 0 ;i< 4; i++){
        var bool = true;
        for(var j = 0; j< 3; j++) {
            if (j == 2 && bool) {
                bool = false;
                j--;
                resultArray.push(" 0");
                continue;
            }
            if(j < 2 ){
                if(betTypeConf[i][self.shunXuArray[j]][bType]){
                    resultArray.push(betTypeConf[i][self.shunXuArray[j]][bType]);
                }else{
                    resultArray.push("0")
                }
            }else{
                if(i == 0){
                    resultArray.push(multiplePeizhi[multiple%10]);
                }else if (i == 1){
                    resultArray.push("0");
                }else if (i == 2){
                    if(multiple <= 60){
                        resultArray.push(tenMultiple[Math.floor(multiple/10)]);
                    }else if(multiple > 60){
                        resultArray.push(tenMultiple[Math.floor(multiple/10)-5]);
                    }else{
                        resultArray.push("0");
                    }
                }else{
                    if(multiple > 60){
                        resultArray.push("2");
                    }else{
                        resultArray.push("0");
                    }
                }
            }
        }
        resultArray.push(" ");
    }
    return resultArray.join("");
};

var test = new saomiao();
//test.start();
test.trans(test.winConf, test.winRow, ["1,3","1","0,1"]);
