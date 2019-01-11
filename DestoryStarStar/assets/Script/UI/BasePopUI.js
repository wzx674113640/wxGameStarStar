
var FactoryItem = require("FactoryItem");
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onLoad () {
        this.CloseAction = null;
        //this.Mask = this.node.parent.getChildByName("Mask");
        this.Mask = this.node.getChildByName("Mask");
        this.BG = this.node.getChildByName("Bg");
    },

    Close()
    {   
        this.Mask.active = false;
        var s = cc.scaleTo(0.2,0.1);
        var call = cc.callFunc(function()
        {
            this.node.active = false;
            if(this.CloseAction!= null)
            {
                this.CloseAction();
            }
        }.bind(this));
        this.node.runAction(cc.sequence(s,call));
    },
    //返回首页按钮
    CloseReturn()
    {
        FactoryItem.Instance.UIMianCom.CloseUI();
        this.node.active = false;
        this.Mask.active = false;
    },

    Show()
    {   
        this.node.active = true;
        this.Mask.active = true;
        this.node.setScale(1);
        this.BG.setScale(0.1);
        var s1 = cc.scaleTo(0.2,1.2);
        var s2 = cc.scaleTo(0.2,0.9);
        var s3 = cc.scaleTo(0.2,1.1);
        var s4 = cc.scaleTo(0.2,1);
        this.BG.runAction(cc.sequence(s1,s2,s3,s4));
    }
});
