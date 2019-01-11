

var UserInfo =  cc.Class({
    extends: cc.Component,

    properties: {
        openid : null,
        id : null,
        nickName : null,
        avatar_url : null,
        score : null,
        getMoney: null,//得到的钱
        money : 0,//总金额
        count: 0,//红包请求次数
        isRecive : true
    },

  
    start () {

    },

    
});
module.exports = UserInfo; 