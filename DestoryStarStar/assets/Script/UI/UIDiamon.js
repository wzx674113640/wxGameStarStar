
var FileServe  = require ("FileServe");
cc.Class({
    extends: require("BasePopUI"),

    properties: {
        
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
    },

    BtnVideo()
    {
        //看视频...奖励5个钻石
    }
});
