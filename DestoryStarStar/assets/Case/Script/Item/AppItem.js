 
var  Helper = require("Helper");

cc.Class({
    extends: cc.Component,

    properties: {
        Img:cc.Sprite,
        //Img1:cc.Sprite,
        IsImg1:true,

        RedImg:cc.Node,

        MoreGameSprite:cc.SpriteFrame,
    },

    start () {
       this.urlList = [];
       this.sFlist = [];
        this.childrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },
    
    setItem(appInfo,action = null)
    {
        if(appInfo.img == undefined)
        {
            console.error("服务器没有成功获取AppID的数据",appInfo);
            return;
        }
        this.node.active = true;
        if(!this.IsImg1)
        {
            Helper.Instance.createAppImage(appInfo.img,this.Img);
        }
        else
        {
            Helper.Instance.createAppImage(appInfo.img1,this.Img)
        }
        var self = this;
    
        this.Img.node.targetOff(this);
        this.Img.node.on(cc.Node.EventType.TOUCH_END, function(event)
        {
            self.childrenRankCom.CG2_AppReqCount(appInfo.id);
            self.childrenRankCom.associatedProgram(appInfo.appid,appInfo.url,appInfo.id);
            if(action!=null)
            {
                action();
            }
        },this);
        this.setRedImg();
    },

    //设置222
    set222Touch()
    {
        if(this.MoreGameSprite!=null)
        {
            this.Img.spriteFrame = this.MoreGameSprite;
        }   
        this.Img.node.targetOff(this);
        var self = this;
        this.Img.node.on(cc.Node.EventType.TOUCH_END, function(event)
        {
            self.childrenRankCom.CG2_AppReqCount("10000");
            self.childrenRankCom.associatedProgram("wx43728d5e0bec2447","pages/index/index?scene=199","10000");
        },this);
        this.setRedImg();
    },

    setRedImg()
    {
        if(this.RedImg != null)
        {
            var active = Math.floor(Math.random()*10) < 5 ? true:false;
            this.RedImg.active = active;
        }
    }
});
