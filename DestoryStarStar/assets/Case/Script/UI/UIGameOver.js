
var FactoryItem = require("FactoryItem");
var UIManage = require("UIManage");
var ShareAndVideo =require("ShareAndVideo");
var Helper = require("Helper");
cc.Class({
    extends: require("BasePopUI"),

    properties: {
        UIScore:cc.Label,
        AppLayout:cc.Node,
        MoreGame:cc.Node
    },

    onLoad()
    {
        this._super();
        this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
        if(!CC_WECHATGAME || Helper.Instance.IsQQ())
        {
            this.AppLayout.active = false;
            this.MoreGame.active = false;
        }
    },

    Show () {
        this._super();
        this.ChildrenRankCom.HideChild();
        var playInfo = FactoryItem.Instance.UIMianCom._PlayInfo;
        this.UIScore.string = playInfo._Score;
        //this.ChildrenRankCom.ShowTwo();
        this.OpenApp();
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
        var index = Math.floor(Math.random()*Info.length);
        this.MoreGame.targetOff(this);
        this.MoreGame.on(cc.Node.EventType.TOUCH_END, function(event)
        {
            this.ChildrenRankCom.CG2_AppReqCount(Info[index].id);
            this.ChildrenRankCom.associatedProgram(Info[index].appid,Info[index].url,Info[index].id);
        },this);   
    },

    Close()
    {
        this._super();
    },

    BtnAgain()
    {
        FactoryItem.Instance.UIMianCom.RestLevel();
        this.Close();
        this.ChildrenRankCom.ResetChildMaxScore();
        this.ChildrenRankCom.ShowChildrenGameOver();
        //this.ChildrenRankCom.ShowOne();
    },
    
    BtnShare()
    {
        ShareAndVideo.Instance.AddShareEvent(()=>
        {
           
        });
    },

    BtnShowRank()
    {
        UIManage.Instance.ShowUIRanking();
        this.Close();
    }
});
