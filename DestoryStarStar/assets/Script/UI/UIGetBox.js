var FactoryItem = require("FactoryItem");

var ShareAndVideo = require("ShareAndVideo");

var FlyUI = require("FlyUI");

cc.Class({
    extends: require("BasePopUI"),

    properties: {
        ImgBox:cc.Node,
        ImgProps: cc.Node,
        LabelProps:cc.Label,
        BtnShare:cc.Node,
        BtnClose:cc.Node,
        BtnEnter:cc.Node,

        PropsUISpriteFrame: {
            type:cc.SpriteFrame,
            default:[],
        }
    },


    Show()
    {
        this.node.active = true;
        this.Mask.active = true;
        this.ImgProps.active = false;
        this.ImgBox.active = true;
        this.BtnShare.active = true;
        this.Close.active = true;
        this.BtnEnter.active = false;
    },

    Close()
    {
        this.node.active = false;
        this.Mask.active = false;
    },

    BtnShareClick()
    {
        ShareAndVideo.Instance.AddShareEvent(()=>
        {
            this.ImgBox.active = false;
            this.ImgProps.active = true;
            this.BtnShare.active = false;
            this.BtnClose.active = false;
            this.BtnEnter.active = true;
    
            this.PropsValue = Math.floor(Math.random()*this.PropsUISpriteFrame.length);
            this.ImgProps.getComponent(cc.Sprite).spriteFrame = this.PropsUISpriteFrame[this.PropsValue];
            if(this.PropsValue == 0)
            {
                this.LabelProps.string = "x5";
            }
            else
            {
                this.LabelProps.string = "x1";
            }
        });
       
    },

    BtnEnterClick()
    {
        FlyUI.Instance.PropsUIFly(this.PropsValue);
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
        this.Close();
    }
});
