/**
 * Created by w44 on 15-1-7.
 */


var ScanDataTrans = function () {
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
    self.mixConf = [
        {"023": 1, "021": 2, "020": 4},
        {"013": 1, "011": 2, "010": 4},
        {"0310": 1, "0342": 2, "0324": 4, "0301": 8},
        {"0320": 1, "0350": 2, "0305": 4, "0302": 8},
        {"0321": 1, "0351": 2, "0315": 4, "0312": 8},
        {"0330": 1, "0352": 2, "0325": 4, "0303": 8},
        {"0331": 1, "0390": 2, "0309": 4, "0313": 8},
        {"0332": 1, "0300": 2, "0333": 4, "0323": 8},
        {"0340": 1, "0311": 2, "0399": 4, "0304": 8},
        {"0341": 1, "0322": 2, "0314": 8},
        {"0533": 1, "0531": 2, "0530": 4 },
        {"0513": 1, "0511": 2, "0510": 4},
        {"0503": 1, "0501": 2, "0500": 4},
        {"040": 1, "041": 2, "042": 4, "043": 8},
        {"044": 1, "045": 2, "046": 4, "047": 8}
    ];
    self.lqWinConf = [{'2':1,'1':2}];
    self.lqwinRow = 1;

    self.lqBigConf = [{'2':2,'1':1}];
    self.lqBigRow = 1;

    self.lqWinFenConf = [
        {'11':1,'12':2, '01':4,02:8},
        {'13':1,'14':2, '03':4,04:8},
        {'15':1,'16':2, '05':4,06:8},
    ];
    self.lqWinFenRow = 3;

    self.mixRow = 15;
    self.shunXuArray = [1, 0, 2];
};


ScanDataTrans.prototype.jcScanNumberTrans = function (ticket) {
    var self = this;

    var numberArray = ticket.numbers.split(";");

    //组装
    var str = pTypePaper[ticket.gameCode + ticket.playTypeCode + ticket.betTypeCode];
    if (!str) {
        return null;
    }
    var tempLen = Math.ceil(numberArray.length / 3);
    for (var i = 0; i < tempLen; i++) {
        var weekDay = new Array();
        var matchArray = new Array();
        var resultArray = new Array();
        var playArray = new Array();
        for (var j = i * 3; j < i * 3 + 3; j++) {
            if (numberArray[j]) {
                var temp = numberArray[j].split("|");
                weekDay.push(temp[1].substr(temp[1].length - 4, 1));
                playArray.push(temp[0]);
                matchArray.push(temp[1].substr(temp[1].length - 3));
                resultArray.push(temp[2]);
            }
        }
        if(ticket.playTypeCode == "06"){
            str += "00 01 ";
        }
        str += self.trans(self.weekConf, self.weekRow, weekDay) + self.changciTrans(matchArray);
        if(ticket.gameCode = 'T51'){
            if (ticket.playTypeCode == "01") { //让球胜平负
                str += self.trans(self.winConf, self.winRow, resultArray);
            }
            else if (ticket.playTypeCode == "02") { //胜平负
                str += self.trans(self.winConf, self.winRow, resultArray);
            }
            else if (ticket.playTypeCode == "04") {//总进球
                str += self.trans(self.zongJinQiu, self.zongJinQiuRow, resultArray);
            }
            else if (ticket.playTypeCode == "05") {//半全场
                str += self.trans(self.halfConf, self.halfRow, resultArray);
            }
            else if (ticket.playTypeCode == "03") {//比分
                str += self.trans(self.scoreConf, self.scoreRow, resultArray);
            }
            else if (ticket.playTypeCode == "06") {//混合
                str += self.transHun(self.mixConf, self.mixRow, resultArray , playArray);
            }
        }else{
            if (ticket.playTypeCode == "01") { //让球胜负
                str += self.trans(self.lqWinConf, self.winRow, resultArray);
            }
            else if (ticket.playTypeCode == "02") { //胜负
                str += self.trans(self.lqWinConf, self.winRow, resultArray);
            }
            else if (ticket.playTypeCode == "03") {//胜分差
                str += self.trans(self.lqWinFenConf, self.lqWinFenRow, resultArray);
            }else if (ticket.playTypeCode == "04") {//大小分
                str += self.trans(self.lqBigConf, self.lqBigRow, resultArray);
            }
        }

    }
    str += self.btypeTrans(ticket.betTypeCode, ticket.multiple);
    return str;
};

var pTypePaper = {
    //胜平负 3关扫描======================================
    'T510211': '01 1c 00 0d 00 0e 00 31 07 ',
    'T510221': '01 1c 00 0d 00 0e 00 31 07 ',
    'T510231': '01 1c 00 0d 00 0e 00 31 07 ',
    'T510233': '01 1c 00 0d 00 0e 00 31 07 ',
    'T510234': '01 1c 00 0d 00 0e 00 31 07 ',
    //胜平负 6关扫描======================================
    'T510241': '01 2c 00 0d 00 16 00 3a 0b ',
    'T510244': '01 2c 00 0d 00 16 00 3a 0b ',
    'T510245': '01 2c 00 0d 00 16 00 3a 0b ',
    'T510246': '01 2c 00 0d 00 16 00 3a 0b ',
    'T5102411': '01 2c 00 0d 00 16 00 3a 0b ',

    'T510251': '01 2c 00 0d 00 16 00 3a 0b ',
    'T510255': '01 2c 00 0d 00 16 00 3a 0b ',
    'T510256': '01 2c 00 0d 00 16 00 3a 0b ',
    'T5102510': '01 2c 00 0d 00 16 00 3a 0b ',
    'T5102516': '01 2c 00 0d 00 16 00 3a 0b ',
    'T5102520': '01 2c 00 0d 00 16 00 3a 0b ',
    'T5102526': '01 2c 00 0d 00 16 00 3a 0b ',

    'T510261': '01 2c 00 0d 00 16 00 3a 0b ',
    'T510266': '01 2c 00 0d 00 16 00 3a 0b ',
    'T510267': '01 2c 00 0d 00 16 00 3a 0b ',
    'T5102615': '01 2c 00 0d 00 16 00 3a 0b ',
    'T5102620': '01 2c 00 0d 00 16 00 3a 0b ',
    'T5102622': '01 2c 00 0d 00 16 00 3a 0b ',
    'T5102635': '01 2c 00 0d 00 16 00 3a 0b ',
    'T5102642': '01 2c 00 0d 00 16 00 3a 0b ',
    'T5102650': '01 2c 00 0d 00 16 00 3a 0b ',
    'T5102657': '01 2c 00 0d 00 16 00 3a 0b ',
    //胜平负 8关扫描======================================
    'T510271': '01 3c 00 0d 00 1e 00 50 0f ',
    'T510277': '01 3c 00 0d 00 1e 00 50 0f ',
    'T510278': '01 3c 00 0d 00 1e 00 50 0f ',
    'T5102721': '01 3c 00 0d 00 1e 00 50 0f ',
    'T5102735': '01 3c 00 0d 00 1e 00 50 0f ',
    'T51027120': '01 3c 00 0d 00 1e 00 50 0f ',

    'T510281': '01 3c 00 0d 00 1e 00 50 0f ',
    'T510288': '01 3c 00 0d 00 1e 00 50 0f ',
    'T510289': '01 3c 00 0d 00 1e 00 50 0f ',
    'T5102828': '01 3c 00 0d 00 1e 00 50 0f ',
    'T5102856': '01 3c 00 0d 00 1e 00 50 0f ',
    'T5102870': '01 3c 00 0d 00 1e 00 50 0f ',
    'T51028247': '01 3c 00 0d 00 1e 00 50 0f ',


    //比分 3关扫描======================================
    'T510311':'01 2a 00 0d 00 15 00 c2 0a ',
    'T510321':'01 2a 00 0d 00 15 00 c2 0a ',
    'T510331':'01 2a 00 0d 00 15 00 c2 0a ',
    'T510333':'01 2a 00 0d 00 15 00 c2 0a ',
    'T510334':'01 2a 00 0d 00 15 00 c2 0a ',

    //总进球 3关扫描======================================
    'T510411':'01 1e 00 0d 00 0f 00 93 07 ',
    'T510421':'01 1e 00 0d 00 0f 00 93 07 ',
    'T510431':'01 1e 00 0d 00 0f 00 93 07 ',
    'T510433':'01 1e 00 0d 00 0f 00 93 07 ',
    'T510434':'01 1e 00 0d 00 0f 00 93 07 ',

    //总进球 6关扫描======================================
    'T510441':'01 30 00 0d 00 18 00 38 0c ',
    'T510444':'01 30 00 0d 00 18 00 38 0c ',
    'T510445':'01 30 00 0d 00 18 00 38 0c ',
    'T510446':'01 30 00 0d 00 18 00 38 0c ',
    'T5104411':'01 30 00 0d 00 18 00 38 0c ',

    'T510451':'01 30 00 0d 00 18 00 38 0c ',
    'T510455':'01 30 00 0d 00 18 00 38 0c ',
    'T510456':'01 30 00 0d 00 18 00 38 0c ',
    'T5104510':'01 30 00 0d 00 18 00 38 0c ',
    'T5104516':'01 30 00 0d 00 18 00 38 0c ',
    'T5104520':'01 30 00 0d 00 18 00 38 0c ',
    'T5104526':'01 30 00 0d 00 18 00 38 0c ',

    'T510461':'01 30 00 0d 00 18 00 38 0c ',
    'T510466':'01 30 00 0d 00 18 00 38 0c ',
    'T510467':'01 30 00 0d 00 18 00 38 0c ',
    'T5104615':'01 30 00 0d 00 18 00 38 0c ',
    'T5104620':'01 30 00 0d 00 18 00 38 0c ',
    'T5104622':'01 30 00 0d 00 18 00 38 0c ',
    'T5104635':'01 30 00 0d 00 18 00 38 0c ',
    'T5104642':'01 30 00 0d 00 18 00 38 0c ',
    'T5104650':'01 30 00 0d 00 18 00 38 0c ',
    'T5104657':'01 30 00 0d 00 18 00 38 0c ',

    //半全场 3关扫描======================================
    'T510511': '01 20 00 0d 00 10 00 32 08 ',
    'T510521': '01 20 00 0d 00 10 00 32 08 ',
    'T510531': '01 20 00 0d 00 10 00 32 08 ',
    'T510533': '01 20 00 0d 00 10 00 32 08 ',
    'T510534': '01 20 00 0d 00 10 00 32 08 ',

    //混合投注 3关扫描======================================
    'T510611': '01 3c 00 0d 00 1e 00 55 0f 08 00 ',
    'T510621': '01 3c 00 0d 00 1e 00 55 0f 08 00 ',
    'T510631': '01 3c 00 0d 00 1e 00 55 0f 08 00 ',
    'T510633': '01 3c 00 0d 00 1e 00 55 0f 08 00 ',
    'T510634': '01 3c 00 0d 00 1e 00 55 0f 08 00 ',


    //篮球胜负 3关扫描======================================
    'T520211': '01 1c 00 0d 00 0e 00 3e 07 ',
    'T520221': '01 1c 00 0d 00 0e 00 3e 07 ',
    'T520231': '01 1c 00 0d 00 0e 00 3e 07 ',
    'T520233': '01 1c 00 0d 00 0e 00 3e 07 ',
    'T520234': '01 1c 00 0d 00 0e 00 3e 07 ',
    //篮球胜负 6关扫描======================================
    'T520241': '01 2c 00 0d 00 16 00 3c 0b ',
    'T520244': '01 2c 00 0d 00 16 00 3c 0b ',
    'T520245': '01 2c 00 0d 00 16 00 3c 0b ',
    'T520246': '01 2c 00 0d 00 16 00 3c 0b ',
    'T5202411': '01 2c 00 0d 00 16 00 3c 0b ',

    'T520251': '01 2c 00 0d 00 16 00 3c 0b ',
    'T520255': '01 2c 00 0d 00 16 00 3c 0b ',
    'T520256': '01 2c 00 0d 00 16 00 3c 0b ',
    'T5202510': '01 2c 00 0d 00 16 00 3c 0b ',
    'T5202516': '01 2c 00 0d 00 16 00 3c 0b ',
    'T5202520': '01 2c 00 0d 00 16 00 3c 0b ',
    'T5202526': '01 2c 00 0d 00 16 00 3c 0b ',

    'T520261': '01 2c 00 0d 00 16 00 3c 0b ',
    'T520266': '01 2c 00 0d 00 16 00 3c 0b ',
    'T520267': '01 2c 00 0d 00 16 00 3c 0b ',
    'T5202615': '01 2c 00 0d 00 16 00 3c 0b ',
    'T5202620': '01 2c 00 0d 00 16 00 3c 0b ',
    'T5202622': '01 2c 00 0d 00 16 00 3c 0b ',
    'T5202635': '01 2c 00 0d 00 16 00 3c 0b ',
    'T5202642': '01 2c 00 0d 00 16 00 3c 0b ',
    'T5202650': '01 2c 00 0d 00 16 00 3c 0b ',
    'T5202657': '01 2c 00 0d 00 16 00 3c 0b ',
    //篮球胜负 8关扫描======================================


    //篮球让分胜负 3关扫描======================================
    'T520111': '01 1c 00 0d 00 0e 00 3e 07 ',
    'T520121': '01 1c 00 0d 00 0e 00 3e 07 ',
    'T520131': '01 1c 00 0d 00 0e 00 3e 07 ',
    'T520133': '01 1c 00 0d 00 0e 00 3e 07 ',
    'T520134': '01 1c 00 0d 00 0e 00 3e 07 ',
    //篮球让分胜负 6关扫描======================================
    'T520141': '01 2c 00 0d 00 16 00 3d 0b ',
    'T520144': '01 2c 00 0d 00 16 00 3d 0b ',
    'T520145': '01 2c 00 0d 00 16 00 3d 0b ',
    'T520146': '01 2c 00 0d 00 16 00 3d 0b ',
    'T5201411': '01 2c 00 0d 00 16 00 3d 0b ',

    'T520151': '01 2c 00 0d 00 16 00 3d 0b ',
    'T520155': '01 2c 00 0d 00 16 00 3d 0b ',
    'T520156': '01 2c 00 0d 00 16 00 3d 0b ',
    'T5201510': '01 2c 00 0d 00 16 00 3d 0b ',
    'T5201516': '01 2c 00 0d 00 16 00 3d 0b ',
    'T5201520': '01 2c 00 0d 00 16 00 3d 0b ',
    'T5201526': '01 2c 00 0d 00 16 00 3d 0b ',

    'T520161': '01 2c 00 0d 00 16 00 3d 0b ',
    'T520166': '01 2c 00 0d 00 16 00 3d 0b ',
    'T520167': '01 2c 00 0d 00 16 00 3d 0b ',
    'T5201615': '01 2c 00 0d 00 16 00 3d 0b ',
    'T5201620': '01 2c 00 0d 00 16 00 3d 0b ',
    'T5201622': '01 2c 00 0d 00 16 00 3d 0b ',
    'T5201635': '01 2c 00 0d 00 16 00 3d 0b ',
    'T5201642': '01 2c 00 0d 00 16 00 3d 0b ',
    'T5201650': '01 2c 00 0d 00 16 00 3d 0b ',
    'T5201657': '01 2c 00 0d 00 16 00 3d 0b ',
    //胜分差 3关扫描======================================
    'T520311':'01 22 00 0d 00 11 00 98 08 ',
    'T520321':'01 22 00 0d 00 11 00 98 08 ',
    'T520331':'01 22 00 0d 00 11 00 98 08 ',
    'T520333':'01 22 00 0d 00 11 00 98 08 ',
    'T520334':'01 22 00 0d 00 11 00 98 08 ',

    //大小分 3关扫描======================================
    'T520411':'01 1c 00 0d 00 0e 00 33 07 ',
    'T520421':'01 1c 00 0d 00 0e 00 33 07 ',
    'T520431':'01 1c 00 0d 00 0e 00 33 07 ',
    'T520433':'01 1c 00 0d 00 0e 00 33 07 ',
    'T520434':'01 1c 00 0d 00 0e 00 33 07 ',

    //大小分 6关扫描======================================
    'T520441':'01 2c 00 0d 00 16 00 21 0b ',
    'T520444':'01 2c 00 0d 00 16 00 21 0b ',
    'T520445':'01 2c 00 0d 00 16 00 21 0b ',
    'T520446':'01 2c 00 0d 00 16 00 21 0b ',
    'T5204411':'01 2c 00 0d 00 16 00 21 0b ',

    'T520451':'01 2c 00 0d 00 16 00 21 0b ',
    'T520455':'01 2c 00 0d 00 16 00 21 0b ',
    'T520456':'01 2c 00 0d 00 16 00 21 0b ',
    'T5204510':'01 2c 00 0d 00 16 00 21 0b ',
    'T5204516':'01 2c 00 0d 00 16 00 21 0b ',
    'T5204520':'01 2c 00 0d 00 16 00 21 0b ',
    'T5204526':'01 2c 00 0d 00 16 00 21 0b ',

    'T520461':'01 2c 00 0d 00 16 00 21 0b ',
    'T520466':'01 2c 00 0d 00 16 00 21 0b ',
    'T520467':'01 2c 00 0d 00 16 00 21 0b ',
    'T5204615':'01 2c 00 0d 00 16 00 21 0b ',
    'T5204620':'01 2c 00 0d 00 16 00 21 0b ',
    'T5204622':'01 2c 00 0d 00 16 00 21 0b ',
    'T5204635':'01 2c 00 0d 00 16 00 21 0b ',
    'T5204642':'01 2c 00 0d 00 16 00 21 0b ',
    'T5204650':'01 2c 00 0d 00 16 00 21 0b ',
    'T5204657':'01 2c 00 0d 00 16 00 21 0b ',


};


ScanDataTrans.prototype.trans = function (confObj, row, array) {
    var self = this;
    var resultArray = new Array();
    resultArray.push("00 00 ");
    for (var i = 0; i < row; i++) {
        var bool = true;
        for (var j = 0; j < 3; j++) {
            if (j == 2 && bool) {
                bool = false;
                j--;
                resultArray.push(" 0");
                continue;
            }
            var result = 0;
            if (array[self.shunXuArray[j]]) {
                var tempArray = array[self.shunXuArray[j]].split(',');
                for (var k = 0; k < tempArray.length; k++) {
                    if (confObj[i][tempArray[k]]) {
                        result += confObj[i][tempArray[k]];
                    }
                }
            }
            resultArray.push(new Number(result).toString(16));
        }
        resultArray.push(" ");
    }
    return resultArray.join("");
};


ScanDataTrans.prototype.changciTrans = function (match) {
    var self = this;
    var Obj = {"0": "0", "1": "1", "2": "2", 3: "3", "4": "4", "5": "8", "6": "6", "7": "a", "8": "b", "9": "c"};
    var weekArray = new Array();
    for (var i = 0; i < 2; i++) {
        var bool = true;
        for (var j = 0; j < 3; j++) {
            if (j == 2 && bool) {
                bool = false;
                j--;
                weekArray.push(" 0");
                continue;
            }
            var tempArray = [0, 0, 0];
            if (match[self.shunXuArray[j]]) {
                tempArray = match[self.shunXuArray[j]].toString().split("").reverse();
            }
            weekArray.push(Obj[tempArray[i]]);
        }
        weekArray.push(" ");
    }
    weekArray.push("00 00 ");
    return weekArray.join("");
};

ScanDataTrans.prototype.btypeTrans = function (bType, multiple) {
    var self = this;
    var resultArray = new Array();
    var betTypeConf = [
        [
            {"21": "1", "31": "2", "33": "4", "34": "8", "41": "1", "44": "2", "45": "4", "46": "8", "71": "1", "77": "2", "78": "4", "721": "8"},
            {"735": "1", "7120": "2", "411": "1", "11": "8"}
        ],
        [
            {"51": "1", "55": "2", "56": "4", "510": "8", "81": "1", "88": "2", "89": "4", "828": "8"},
            {"516": "1", "520": "2", "526": "4", "856": "1", "870": "2", "8247": "4"}
        ],
        [
            {"61": "1", "66": "2", "67": "4", "615": "8"},
            {"620": "1", "622": "2", "635": "4", "642": "8"}
        ],
        [
            {"650": "1", "657": "2"},
            {}
        ]
    ];
    var multiplePeizhi = {"0":"0","1":"1","2":"2","3":"4","4":"8","5":"6","6":"7","7":"c","8":"d","9":"e"};
    var tenMultiple= {"0":"0","1":"2","2":"4","3":"8","4":"a","5":"c","6":"e"};
    resultArray.push("00 00 ");
    for (var i = 0; i < 4; i++) {
        var bool = true;
        for (var j = 0; j < 3; j++) {
            if (j == 2 && bool) {
                bool = false;
                j--;
                resultArray.push(" 0");
                continue;
            }
            if (j < 2) {
                if (betTypeConf[i][self.shunXuArray[j]][bType]) {
                    resultArray.push(betTypeConf[i][self.shunXuArray[j]][bType]);
                } else {
                    resultArray.push("0")
                }
            } else {
                if (i == 0) {
                    resultArray.push(multiplePeizhi[multiple % 10]);
                } else if (i == 1) {
                    resultArray.push("0");
                } else if (i == 2) {
                    if (multiple <= 60) {
                        resultArray.push(tenMultiple[Math.floor(multiple / 10)]);
                    } else if (multiple > 60) {
                        resultArray.push(tenMultiple[Math.floor(multiple / 10) - 5]);
                    } else {
                        resultArray.push("0");
                    }
                } else {
                    if (multiple > 60) {
                        resultArray.push("2");
                    } else {
                        resultArray.push("0");
                    }
                }
            }
        }
        resultArray.push(" ");
    }
    return resultArray.join("");
};


ScanDataTrans.prototype.transHun = function (confObj, row, array, playArray) {
    var self = this;
    var resultArray = new Array();
    resultArray.push("00 00 ");
    for (var i = 0; i < row; i++) {
        var bool = true;
        for (var j = 0; j < 3; j++) {
            if (j == 2 && bool) {
                bool = false;
                j--;
                resultArray.push(" 0");
                continue;
            }
            var result = 0;
            if (array[self.shunXuArray[j]]) {
                var tempArray = array[self.shunXuArray[j]].split(',');
                var playType = playArray[self.shunXuArray[j]];
                for (var k = 0; k < tempArray.length; k++) {
                    var temp = playType + tempArray[k];
                    if (confObj[i][temp]) {
                        result += confObj[i][temp];
                    }
                }
            }
            resultArray.push(new Number(result).toString(16));
        }
        resultArray.push(" ");
    }
    console.log(resultArray.join(""));
    return resultArray.join("");
};

var scanDataTrans = new ScanDataTrans();
var tickt =
    {
        gameCode: 'T52', playTypeCode: '01', betTypeCode: '11', amount: 200,
        multiple: 1, outerId: "123",
        numbers: '01|201512233301|1'
    };
console.log(scanDataTrans.jcScanNumberTrans(tickt));
