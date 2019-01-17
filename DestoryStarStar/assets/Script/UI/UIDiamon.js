
var ShareAndVideo  = require("ShareAndVideo");

var UIManage = require("UIManage");



cc.Class({
    extends: require("BasePopUI"),

    properties: {
        BtnSeeVideo:cc.Node,
        action : null
    },
    
   
    onLoad()
    {
        this._super();
        this.childrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },

    start()
    {
        this.GameInitCom = cc.find("Canvas").getComponent("GameInit");
        
    },

    onEnable()
    {
        if(!CC_WECHATGAME)
            return;
        if(this.childrenRankCom.playInfo._is_status == 1)
        {
            this.BtnSeeVideo.active = true;
        }
        else
        {
            this.BtnSeeVideo.active = false;
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
        if(this.action!=null)
        {
            this.action();
            this.action = null;
        }
    },

    BtnVideo()
    {
        /*
        ShareAndVideo.Instance.AddShareEvent(()=>
        {
            if(UIManage.Instance.SceneState == "Gaming")
            {
                var FactoryItem = require("FactoryItem");
                FactoryItem.Instance.UIMianCom.UserDiamond(10); 
            }
            else if(UIManage.Instance.SceneState =="Start")
            {
                this.GameInitCom.PopsList.Diamond+=10;
                
                UIManage.Instance.UIList[UIManage.Instance.Starting.name].getComponent("UIStart").SetDiamond();
            }
            this.Close();
        });
        */
        
        //看视频...奖励5个钻石
        ShareAndVideo.Instance.SeeVedioClick(()=>
        {
            if(UIManage.Instance.SceneState == "Gaming")
            {
                var FactoryItem = require("FactoryItem");
                FactoryItem.Instance.UIMianCom.UserDiamond(30); 
            }
            else if(UIManage.Instance.SceneState =="Start")
            {
                this.GameInitCom.PopsList.Diamond+=30;
                
                UIManage.Instance.UIList[UIManage.Instance.Starting.name].getComponent("UIStart").SetDiamond();
            }
            this.Close();
        },"获得钻石X30");
    }
});
