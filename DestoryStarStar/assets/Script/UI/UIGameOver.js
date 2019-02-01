
var FactoryItem = require("FactoryItem");
var UIManage = require("UIManage");
var ShareAndVideo =require("ShareAndVideo");
cc.Class({
    extends: require("BasePopUI"),

    properties: {
        UIScore:cc.Label,
        AppLayout:cc.Node,
    },

    onLoad()
    {
        this._super();
        this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },

    Show () {
        this._super();
        this.ChildrenRankCom.HideChild();
        var playInfo =  FactoryItem.Instance.UIMianCom._PlayInfo;
        this.UIScore.string = playInfo._Score;
        //this.ChildrenRankCom.ShowTwo();
        this.OpenApp();
    },

    OpenApp()
    {
        var Info = this.ChildrenRankCom._AppIDInfoList;
        for(var i = 0; i<this.AppLayout.children.length;i++)
        {
            if(Info.length>i)
            {
                this.AppLayout.children[i].getComponent("AppItem").setItem(Info[i]);
            }
        }   
        
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
