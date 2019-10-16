var ShareAndVideo = require("ShareAndVideo");

cc.Class({
    extends: require("BasePopUI"),

    properties: {
       LayoutNode:cc.Node
    },

    onLoad()
    {
        this._super();
        this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },

    Show()
    {
        //this._super();
        this.node.active = true;
        this.Mask.active = true;
        this.node.setScale(1);
        this.BG.setScale(0.1);
        var s1 = cc.scaleTo(0.2,1.1);
        var s2 = cc.scaleTo(0.2,0.8);
        var s3 = cc.scaleTo(0.2,1.05);
        var s4 = cc.scaleTo(0.2,1);
        this.BG.runAction(cc.sequence(s1,s2,s3,s4));
        
        this.ChildrenRankCom.CG2_ShareFriendList((data)=>
        {
            for(var i = 0;i<this.LayoutNode.children.length;i++)
            {
                this.LayoutNode.children[i].active = true;
                this.LayoutNode.children[i].getComponent("ShareItem").SetShareItem(data[i]);
            }
        });
    },

    Close()
    {
        this._super();
    },

    start () {

    },

    BtnClickShare()
    {
        ShareAndVideo.Instance.AddShareEvent(()=>
        {
            
        },true);
    }

});
