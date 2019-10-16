

var Helper = require("Helper");
cc.Class({
    extends: cc.Component,

    properties: {
        LableTile:cc.Label,
        Label1:cc.Label,
        Label2:cc.Label,

        SpriteTile:cc.Sprite,
        SpriteFriend1:cc.Sprite,
        SpriteFriend2:cc.Sprite,
        SpriteFriend3:cc.Sprite,

    },

    Show()
    {
        this.node.active = true;
        this.LableTile.string = this.Views.title;
        this.Label1.string = this.Views.des;
        this.Label2.string = this.Views.txt;
        Helper.Instance.createAppImage(this.Views.img,this.SpriteTile);
        Helper.Instance.createAppImage(this.Views.head[0],this.SpriteFriend1);
        Helper.Instance.createAppImage(this.Views.head[1],this.SpriteFriend2);
        Helper.Instance.createAppImage(this.Views.head[2],this.SpriteFriend3);
    },

    onLoad () {
        this.ChildrenCom = cc.find("wx").getComponent("ChildrenRank");
        this.Views = this.ChildrenCom.views;
    },
    
    EnterGameClick()
    {
        this.ChildrenCom.CG2_AppReqCount(this.Views.id);
        this.ChildrenCom.associatedProgram(this.Views.appid,this.Views.url,this.Views.id);
    },
    
    CloseClick()
    {
        this.node.active = false;
    }
});
