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

        BtnVideo:cc.Node,

        PropsUISpriteFrame: {
            type:cc.SpriteFrame,
            default:[],
        }
    },

    
    onLoad()
    {
        this._super();
        this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
        this.ImgLigth = this.node.getChildByName("ImgLight");
        var r =  cc.rotateBy(2,90);
        this.ImgLigth.runAction(cc.repeatForever(r));
    },

    Show()
    {
        var value = Math.floor(Math.random()*2);
        if(value == 0)
        {
            this.BtnShare.active = false;
            this.BtnVideo.active = true;
        }
        else
        {
            this.BtnShare.active = true;
            this.BtnVideo.active = false;
        }
        this.node.active = true;
        this.Mask.active = true;
        this.ImgProps.active = false;
        this.ImgBox.active = true;
        this.BtnClose.active = true;
        this.PropsValue = Math.floor(Math.random()*this.PropsUISpriteFrame.length);
        if (!CC_WECHATGAME)
            return;
        if(this.ChildrenRankCom.playInfo._is_status == 1)
        {
            this.BtnShare.active = true;
            this.BtnEnter.active = false;
        }
        else
        {
            this.BtnShare.active = false;
            this.BtnEnter.active = true;
        }
        
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
            this.GetBox();
        });
       
    },

    BtnVideoClick()
    {
        ShareAndVideo.Instance.ShareAndVideo(()=>
        {
            this.GetBox();
        });
    },
    
    GetBox()
    {
        this.ImgBox.active = false;
        this.ImgProps.active = true;
        this.BtnShare.active = false;
        this.BtnVideo.active = false;
        this.BtnClose.active = false;
        this.BtnEnter.active = true;

        this.ImgProps.getComponent(cc.Sprite).spriteFrame = this.PropsUISpriteFrame[this.PropsValue];
        if(this.PropsValue == 0)
        {
            this.LabelProps.string = "x5";
        }
        else
        {
            this.LabelProps.string = "x1";
        }
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
