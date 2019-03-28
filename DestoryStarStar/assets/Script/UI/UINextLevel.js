var FactoryItem = require("FactoryItem");
var ShareAndVideo = require("ShareAndVideo");

cc.Class({
    extends: require("BasePopUI"),

    properties: {
        LabelLevel:cc.Label,
        LabelScore:cc.Label,
    },


    Close()
    {
        this._super();
        //返回首页 TODO
        this.CloseAction = ()=>
        {
            this.isStart = false;
        }
    },

    start()
    {
        this.isStart = false;
    },

    Show()
    {
        this._super();
        this.playInfo =  FactoryItem.Instance.UIMianCom._PlayInfo;
        this.LabelLevel.string = "第"+this.playInfo._Level+"关";
        this.LabelScore.string = this.playInfo._Score;
    },

    BtnNextLevel()
    {
        if(this.isStart)
        {
            return;
        }
        this.isStart = true;
        this.Close();
        FactoryItem.Instance.UIMianCom.NextLevel();
        /*
        if(this.playInfo._Level % 2 == 0)
        {
            ShareAndVideo.Instance.ShowOrHideAdervert(false);
            ShareAndVideo.Instance.ShowOrHideAdervert(true);
        }
        
        //刷新广告
       
        FactoryItem.Instance.UIMianCom.ShowUpAppItem();
        */
    },

    BtnShare()
    {
        ShareAndVideo.Instance.AddShareEvent(()=>
        {
            
        });
    },
    
});
