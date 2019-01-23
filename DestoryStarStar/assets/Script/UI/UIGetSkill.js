var ShareAndVideo = require("ShareAndVideo");
var FactoryItem = require("FactoryItem");
var FileServe = require("FileServe");
cc.Class({
    extends: require("BasePopUI"),

    properties: {
        BtnClose: cc.Node,
        BtnEnter:cc.Node,
        BtnShare:cc.Node,
        BtnVideo:cc.Node
    },

    onLoad()
    {
        this._super();
        this.childrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },

    Show()
    {
        this.node.active = true;
        this.Mask.active = true;
        this.BtnClose.active = true;
        if (!CC_WECHATGAME)
            return;
        if(this.childrenRankCom.playInfo._is_status == 1)
        {
            if(FileServe.Instance.GetAllVideoCount()<=0)
            {
                this.BtnShare.active = true;
                this.BtnEnter.active = false;
                this.BtnVideo.active = false;
            }
            else
            {
                var value = Math.floor(Math.random()*2);
                if(value == 0)
                {
                    this.BtnVideo.active = false;
                    this.BtnEnter.active = false;
                    this.BtnShare.active = true;
                }
                else
                {   
                    this.BtnVideo.active = true;
                    this.BtnShare.active = false;
                    this.BtnEnter.active = false;
                }
            }
        }
        else
        {
            this.BtnEnter.active = true;
            this.BtnShare.active= false;
            this.BtnVideo.active = false;
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
            this.BtnClose.active = false;
            this.BtnEnter.active = true;
            this.BtnShare.active = false;
            this.BtnVideo.active = false;
        });
    },

    BtnVideoClick()
    {
        ShareAndVideo.Instance.SeeVedioClick(()=>
        {
            this.BtnClose.active = false;
            this.BtnEnter.active = true;
            this.BtnShare.active = false;
            this.BtnVideo.active = false;
        });
    },

    BtnEnterClick()
    {
        this.Close();
        FactoryItem.Instance.DestorySameColorProps();
    },

});
