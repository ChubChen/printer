/**
 * Created by CH on 15-3-23.
 */
var saomiao = function(){
    var ticktes = [{
        gameCode:'T51', pType:'02', bType:'21', amount:200,
        multiple:1, outerId:"123",
        number:'02|201503227006|3;02|201503226007|1;02|201503227005|0'
    }];
    this.ticket = ticktes;
};
saomiao.prototype.start = function(){
    var array = [1,2,4,8];
    var duiarray = [0,1,2,3,4,8,9,'A','B','C'];
    var self = this;
    var iterm = this.ticket;
    var dingzhi = "01 1c 00 0d 00 0e 00 31 07 ";
    var arrayLine = new Array();
    arrayLine[0] = new Array();
    arrayLine[1] = new Array();
    arrayLine[2] = new Array();
    arrayLine[3] = new Array();
    arrayLine[4] = new Array();
    for(var i = 0 ; i<iterm.length ; i++){
        var btype = iterm[i].bType;
        var numberarray = iterm[i].number.split(";");
        for(var j = 0 ; j<numberarray.length; j++){
            var number = numberarray[j].split("|");
            var day = parseInt(number[1].substr(number[1].length-4 , 1),10);
            var changci  = number[1].substr(number[1].length-3).split("");
            if(day > 4){
               arrayLine[1].push(array[day-5]);
            }else{
                arrayLine[0].push(array[day-1]);
            }
            arrayLine[2].push(duiarray[changci[2]]);
            arrayLine[3].push(duiarray[changci[1]]);
            arrayLine[4].push(duiarray[changci[0]]);
        }

        console.log(arrayLine[0]);
        console.log(arrayLine[1]);
        console.log(arrayLine[2]);
        console.log(arrayLine[3]);
    }
};
var test = new saomiao();
test.start();
//console.log(Number(9).toString(2 ))