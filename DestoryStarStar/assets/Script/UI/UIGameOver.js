
var FactoryItem = require("FactoryItem");
var UIManage = require("UIManage");
var ShareAndVideo =require("ShareAndVideo");
cc.Class({
    extends: require("BasePopUI"),

    properties: {
        UIScore:cc.Label,
    },

    onLoad()
    {
        this._super();
        this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },

    Show () {
        this._super();
        var playInfo =  FactoryItem.Instance.UIMianCom._PlayInfo;
        this.UIScore.string = playInfo._Score;
        this.ChildrenRankCom.ShowTwo();
    },

    Close()
    {
        this._super();
        this.ChildrenRankCom.HideChild();
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
