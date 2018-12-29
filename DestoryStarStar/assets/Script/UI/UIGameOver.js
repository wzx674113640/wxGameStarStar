
var FactoryItem = require("FactoryItem");
var UIManage = require("UIManage");
var ShareAndVideo =require("ShareAndVideo");
cc.Class({
    extends: require("BasePopUI"),

    properties: {
        UIScore:cc.Label,
    },

    Show () {
        this._super();
        var playInfo =  FactoryItem.Instance.UIMianCom._PlayInfo;
        this.UIScore.string = playInfo._Score;
    },

    BtnAgain()
    {
        FactoryItem.Instance.UIMianCom.RestLevel();
        this.Close();
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
    }
});
