

cc.Class({
    extends: cc.Component,

    properties: {
        BtnAppList:cc.Node,
        LeftAppNodeList:cc.Node,
        BtnAppListSprite:
        {
            type:cc.SpriteFrame,
            default:[],
        }
    },

    start () {
        this.isOpen = false;
    },

    AppClick()
    {
        if(this.isOpen == false)
        {
            var m = cc.moveBy(0.3,cc.v2(425,0));
            this.BtnAppList.runAction(m);
            this.isOpen = true;
            this.BtnAppList.getComponent(cc.Sprite).spriteFrame = this.BtnAppListSprite[0];
        }
        else
        {
            var m = cc.moveBy(0.3,cc.v2(-425,0));
            this.BtnAppList.runAction(m);
            this.isOpen = false;
            this.BtnAppList.getComponent(cc.Sprite).spriteFrame = this.BtnAppListSprite[1];
        }
    },
    ShowItem(AppIDInfoList,Applength)
    {
        for(var i = 0;i < this.LeftAppNodeList.children.length;i++)
        {
            if(Applength > i)
            {
                this.LeftAppNodeList.children[i].getComponent("AppItem").setItem(AppIDInfoList[i]);
            }
            else
            {
                this.LeftAppNodeList.children[i].active = false;
            }
        }
    }
});
