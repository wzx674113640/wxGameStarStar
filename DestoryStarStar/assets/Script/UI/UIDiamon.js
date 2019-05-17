
var ShareAndVideo  = require("ShareAndVideo");

var UIManage = require("UIManage");

var FileServe = require("FileServe");

cc.Class({
    extends: require("BasePopUI"),

    properties: {
        BtnSeeVideo:cc.Node,
        BtnShare:cc.Node,
        _action : null,
        DiamondLabel: cc.Label
    },
    
    onLoad()
    {
        this._super();
        this.childrenRankCom = cc.find("wx").getComponent("ChildrenRank");
        this.GameInitCom = cc.find("Canvas").getComponent("GameInit");
    },

    start()
    {
       
    },

    onEnable()
    {
        if(!CC_WECHATGAME)
            return;
        this.DiamondLabel.string = this.GameInitCom.PopsList.Diamond;
        if(this.childrenRankCom.playInfo._is_status == 1 || this.childrenRankCom.playInfo._is_status == undefined)
        {
            if(this.childrenRankCom.playInfo.is_share == 1 || this.childrenRankCom.playInfo.is_share == undefined)
            {
                if(FileServe.Instance.GetAllVideoCount()<=0)
                {
                    this.BtnSeeVideo.active = false;
                    this.BtnShare.active = true;
                }
                else
                {
                    this.BtnSeeVideo.active = true;
                    this.BtnShare.active = false;
                }
            }
            else
            {   
                this.BtnSeeVideo.active = true;
                this.BtnShare.active = false;
            }
            
        }
        else
        {
            this.BtnSeeVideo.active = true;
            this.BtnShare.active = false;
        }
    },

    Close()
    {
        this.Mask.active = false;
        var s = cc.scaleTo(0.2,0.1);
        var call = cc.callFunc(function()
        {
            this.node.active = false;
        }.bind(this));
        this.node.runAction(cc.sequence(s,call));
        if(this._action!=null)
        {
            this._action();
            this._action = null;
        }
    },

    BtnVideo() 
    {
        var Count = FileServe.Instance.GetDimondVideoCount();
        if(Count == -1)
        {
            if(CC_WECHATGAME)
            {
                wx.showToast({
                    title: '今日次数用尽',
                    icon: 'success',
                    duration: 800
                })
            }
        }
        else
        {
            var self = this;
            //看视频...奖励5个钻石
            ShareAndVideo.Instance.SeeVedioClick(()=>
            {
                self.getDimond(Count);
            },"获得星星x30");
        }
        
    },

    getDimond(count)
    {
        if(UIManage.Instance.SceneState == "Gaming")
        {
            var FactoryItem = require("FactoryItem");
            FactoryItem.Instance.UIMianCom.UserDiamond(30); 
        }
        else if(UIManage.Instance.SceneState =="Start")
        {
            this.GameInitCom.PopsList.Diamond+=30;
            
            UIManage.Instance.Starting.getComponent("UIStart").SetDiamond();
        }
        this.DiamondLabel.string = this.GameInitCom.PopsList.Diamond;
        this.Close();
        count--;
        cc.sys.localStorage.setItem("DimondCount",count);
        
    },

    BtnShareClick()
    {
        var Count = FileServe.Instance.GetDimondVideoCount();
        if(Count == -1)
        {
            if(CC_WECHATGAME)
            {
                wx.showToast({
                    title: '今日次数用尽',
                    icon: 'success',
                    duration: 800
                })
            }
        }
        else
        {
            var self = this;
            ShareAndVideo.Instance.AddShareEvent(()=>
            {
                self.getDimond(Count);
            })
        }
        
    }
});
