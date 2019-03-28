
var ShareAndVideo = require("ShareAndVideo");
var UIManage = require("UIManage");
cc.Class({
    extends: require("BasePopUI"),

    properties: {
        
    },

    start () {
        this.GameInitCom = cc.find("Canvas").getComponent("GameInit");
        this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },
    //获得奖励
    GetProps(isDouble = false)
    {
        this.ChildrenRankCom.CG2_DailyWelfare();
        if(isDouble)
        {
            this.GameInitCom.PopsList.Diamond += 100;
            this.GameInitCom.PopsList.Hammer += 2;
            this.GameInitCom.PopsList.Reset += 2;
        }
        else
        {
            this.GameInitCom.PopsList.Diamond += 50;
            this.GameInitCom.PopsList.Hammer += 1;
            this.GameInitCom.PopsList.Reset += 1;
        }
        
        if(CC_WECHATGAME)
        {
            wx.showToast({
                title: "领取成功",
                icon: 'success',
                duration: 800
            })
        }
        this.Close();
        cc.sys.localStorage.setItem("TimeGift","0");//领完
   
        UIManage.Instance.Starting.getComponent("UIStart").TimeLoad();
    },

    BtnGetProp()
    {
        this.GetProps();
    },

    BtnVideoGetProp()
    {
        ShareAndVideo.Instance.SeeVedioClick(()=>
        {
            this.GetProps(true);
        });
    }
});
