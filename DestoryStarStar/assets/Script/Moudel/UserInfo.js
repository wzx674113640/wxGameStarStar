

var UserInfo =  cc.Class({
    extends: cc.Component,

    properties: {
        openid : 0,
        id : null,
        nickName : null,
        avatar_url : null,
        score : null,
        _getMoney : 0,
        getMoney: {
            get()
            {
                return this._getMoney;
            },
            set(value)
            {
                var realValue = this.toDecimal2(value)*200;
                
                this._getMoney = realValue;
            }            
        },//得到的钱
        _money: 0,
        money: {
            get()
            {
                return this._money;
            },
            set(value)
            {
                var realValue = this.toDecimal2(value)*200;
                this._money = realValue;
            }
        },//总金额
        count: 0,//红包请求次数
        isRecive : true
    },

  
    toDecimal2(x) { 
          var f = parseFloat(x); 
          if (isNaN(f)) { 
            return false; 
          } 
          var f = Math.round(x*100)/100; 
          var s = f.toString(); 
          var rs = s.indexOf('.'); 
          if (rs < 0) { 
            rs = s.length; 
            s += '.'; 
          } 
          while (s.length <= rs + 2) { 
            s += '0'; 
          } 
          return s; 
    }
        

    
});
module.exports = UserInfo; 