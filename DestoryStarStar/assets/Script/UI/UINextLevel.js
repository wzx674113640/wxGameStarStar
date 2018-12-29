var FactoryItem = require("FactoryItem");
var ShareAndVideo = require("ShareAndVideo");

cc.Class({
    extends: require("BasePopUI"),

    properties: {
        LabelLevel:cc.Label,
        LabelScore:cc.Label,
        LightUI:cc.Node,
    },


    Close()
    {
        this._super();
        //返回首页 TODO
    },

    Show()
    {
        this._super();
        var playInfo =  FactoryItem.Instance.UIMianCom._PlayInfo;
        this.LabelLevel.string = "第"+playInfo._Level+"关";
        this.LabelScore.string = playInfo._Score;
    },

    BtnNextLevel()
    {
        this.Close();
        FactoryItem.Instance.UIMianCom.NextLevel();
    },

    BtnShare()
    {
        ShareAndVideo.Instance.AddShareEvent(()=>
        {
            
        });
    },
    update(dt)
    {
        this.LightUI.rotation += dt*10;
    }
    
});
