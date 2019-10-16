var FactoryItem = require("FactoryItem");
var Helper = require("Helper");
cc.Class({
    extends: cc.Component,

    properties: {
        AppLayout:cc.Node
    },

    onLoad() 
    {
        this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
        if(!CC_WECHATGAME || Helper.Instance.IsQQ())
        {
            this.AppLayout.active = false;
        }
    },

    Show(Action)
    {
        this.node.active = true;
        this.CloseEvent = Action;
        this.OpenApp();
    },

    BtnClose()
    {
        this.Action();
        this.node.active = false;
    },

    BtnUserReset()
    {
        this.node.active = false;
        FactoryItem.Instance.UIMianCom.UserResetControl();
    },

    OpenApp()
    {
        var Info = this.ChildrenRankCom.SetAppItem();
        for(var i = 0; i<this.AppLayout.children.length;i++)
        {
            if(Info.length>i)
            {
                this.AppLayout.children[i].getComponent("AppItem").setItem(Info[i]);
            }
        }   
    },
}); 


