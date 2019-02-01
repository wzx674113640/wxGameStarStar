 
var  Helper = require("Helper");

cc.Class({
    extends: cc.Component,

    properties: {
        Img:cc.Sprite,
        //Img1:cc.Sprite,
        IsImg1:true,
    },

    start () {
       this.urlList = [];
       this.sFlist = [];
        //this.Img = this.node.getChildByName('HeadImge').getComponent(cc.Sprite);
        //this.Name = this.node.getChildByName("Name").getComponent(cc.Label);
        this.childrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },
    
    setItem(appInfo,action = null)
    {
        this.node.active = true;
        if(!this.IsImg1)
        {
            Helper.Instance.createAppImage(appInfo.img,this.Img);
        }
        else
        {
            Helper.Instance.createAppImage(appInfo.img1,this.Img)
        }

        //this.Name.node.active = false;
        //this.ImgYuan.node.active = true;
        //this.Name.string = appInfo.title.length <= 4 ? appInfo.title : appInfo.title.substr(0, 4) ;
       
        var self = this;
    
        this.Img.node.targetOff(this);
        this.Img.node.on(cc.Node.EventType.TOUCH_START, function(event)
        {
            self.childrenRankCom.CG2_AppReqCount(appInfo.id);
            self.childrenRankCom.associatedProgram(appInfo.appid,appInfo.url,appInfo.id);
            if(action!=null)
            {
                action();
            }
        },this);
    },   
    
});
