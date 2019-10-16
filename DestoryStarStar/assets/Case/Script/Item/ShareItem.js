var ShareAndVideo = require("ShareAndVideo");
var UIManage = require("UIManage");

cc.Class({
    extends: cc.Component,

    properties: {
       ImgHead:cc.Sprite,
       LabelDiamon:cc.Label,
       BtnShare:cc.Node,
       BtnGet:cc.Node,
       LabelRank:cc.Node,
       ImgAlready:cc.Node
    },

    onLoad()
    {
       this.DimonCount = 0;
       this.ID = 0;
       this.GameInitCom =  cc.find("Canvas").getComponent("GameInit");
       this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },

    SetShareItem(data)
    {
        switch(data.status)
        {
            case 0:
                this.SetState("Share");
                break;
            case 1:
                this.SetState("CanGet");
                break;
            case 2:
                this.SetState("AlreadyGet");
                break;
        }
        this.LabelDiamon.string = "x" + data.diamonds;
        this.DimonCount = data.diamonds;
        this.id = data.id;
    },

    BtnShareClick()
    {
        ShareAndVideo.Instance.AddShareEvent(()=>
        {
            
        },true);
    },   

    BtnGetClick()
    {
        var self = this;
        this.ChildrenRankCom.CG2_ShareFriendreg(()=>
        {
            this.GameInitCom.PopsList.Diamond += this.DimonCount;
            UIManage.Instance.Starting.getComponent("UIStart").SetDiamond();
            self.SetState("AlreadyGet");
            wx.showToast({
                title: "获得钻石x"+self.DimonCount,
                icon: 'success',
                duration: 800
            });
        },self.id);
    },

    SetState(state)
    {
        switch(state)
        {
            case "Share": //需要分享
                this.BtnShare.active = true;
                this.BtnGet.active = false;
                this.ImgAlready.active = false;
                break;
            case "CanGet": //可以领取
                this.BtnShare.active = false;
                this.BtnGet.active = true;
                this.ImgAlready.active = false;
                break;
            case "AlreadyGet": //已经领取
                this.BtnShare.active = false;
                this.BtnGet.active = false;
                this.ImgAlready.active = true;
                break;
        }
    },

   
});
