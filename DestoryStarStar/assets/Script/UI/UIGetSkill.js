var ShareAndVideo = require("ShareAndVideo");
var FactoryItem = require("FactoryItem");
var FileServe = require("FileServe");
cc.Class({
    extends: require("BasePopUI"),

    properties: {
        BtnClose: cc.Node,
        BtnEnter:cc.Node,
        BtnShare:cc.Node,
        BtnVideo:cc.Node,
        AppLayout:cc.Node,
    },

    onLoad()
    {
        this._super();
        this.childrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },

    Show()
    {
        if (!CC_WECHATGAME)
            return;
        if(this.childrenRankCom.playInfo._is_status == 1 || this.childrenRankCom.playInfo._is_status == undefined)
        {
            if(this.childrenRankCom.playInfo.is_share == 1)
            {
                
                if(FileServe.Instance.GetAllVideoCount()<=0)
                {
                    this.BtnShare.active = true;
                    this.BtnEnter.active = false;
                    this.BtnVideo.active = false;
                }
                else
                {
                    this.BtnVideo.active = true;
                    this.BtnShare.active = false;
                    this.BtnEnter.active = false;
                }
            }
            else
            {   
                this.BtnVideo.active = true;
                this.BtnShare.active = false;
                this.BtnEnter.active = false;
            }   
        }
        else
        {
            this.BtnEnter.active = true;
            this.BtnShare.active= false;
            this.BtnVideo.active = false;
        }
        this.OpenApp();
    },

    OpenApp()
    {
        var Info = this.childrenRankCom.SetAppItem();
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
        this.node.active = false;
        this.Mask.active = false;
        if(this.NotNeedReward != null)
        {
            ShareAndVideo.Instance.AdervertActive(true);
        }
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
