 
var  Helper = require("Helper");

cc.Class({
    extends: cc.Component,

    properties: {
        Img:cc.Sprite,
        Name:cc.Label
    },


    start () {
       
        //this.Img = this.node.getChildByName('HeadImge').getComponent(cc.Sprite);
        //this.Name = this.node.getChildByName("Name").getComponent(cc.Label);
        this.childrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },
    
    setItem(appInfo)
    {
        this.node.active = true;
        Helper.Instance.createImage(appInfo.img,this.Img);
        //this.Name.string = appInfo.title;
        this.Name.string = appInfo.title.length <= 4 ? appInfo.title : appInfo.title.substr(0, 4) + "...";

        var self = this;
        this.Img.node.targetOff(this.Img.node);
        this.Img.node.on(cc.Node.EventType.TOUCH_START, function(event)
        {
            self.childrenRankCom.CG2_AppReqCount(appInfo.id);
            self.childrenRankCom.associatedProgram(appInfo.appid,appInfo.url);
        });
    },   
});
