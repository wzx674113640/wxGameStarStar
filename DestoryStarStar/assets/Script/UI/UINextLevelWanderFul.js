
var ShareAndVideo = require("ShareAndVideo");
var FlyUI = require("FlyUI");
cc.Class({
    extends: require("UINextLevel"),

    properties: {
        PropsUI:cc.Sprite,
        LabelProps:cc.Label,
        PropsUISpriteFrame: {
            type:cc.SpriteFrame,
            default:[],
        },
    },

    onLoad()
    {
        this._super();
        this.childrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },

    Show()
    {
        this._super();
       
        this.PropsValue = Math.floor(Math.random()*this.PropsUISpriteFrame.length);
        this.PropsUI.spriteFrame = this.PropsUISpriteFrame[this.PropsValue];
        if(this.PropsValue == 0)
        {
            this.LabelProps.string = "x5";
        }
        else
        {
            this.LabelProps.string = "x1";
        }
    },

    BtnGetProps()
    {
        if(this.childrenRankCom.playInfo._is_status == 1)
        {
            ShareAndVideo.Instance.ShareAndVideo(()=>
            {
                FlyUI.Instance.PropsUIFly(this.PropsValue);
                this.BtnNextLevel();
            });
        }
        else
        {
            FlyUI.Instance.PropsUIFly(this.PropsValue);
            this.BtnNextLevel();
        }
        
        //看广告...
        /*
        switch(this.PropsValue)
        {
            case 0:
                FactoryItem.Instance.UIMianCom.UserDiamond(5);
                break;
            case 1:
                FactoryItem.Instance.UIMianCom.UserReset(1);
                break;
            case 2:
                FactoryItem.Instance.UIMianCom.UserHammerProps(1);
                break;
            case 3:
                FactoryItem.Instance.UIMianCom.UserChange(1);
                break;
        }
        */
        
    },

    BtnNoProps()
    {
        this.BtnNextLevel();
        if(this.NotNeedReward != null)
        {
            ShareAndVideo.Instance.AdervertActive(true);
        }
    },
   
});
