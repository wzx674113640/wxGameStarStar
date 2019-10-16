

cc.Class({
    extends: cc.Component,

    properties: {
        BtnAppList:cc.Node,
        LeftAppNodeList:cc.Node,
        BtnAppListSprite:
        {
            type:cc.SpriteFrame,
            default:[],
        }, 
        ScrollView:cc.ScrollView,
        Mask:cc.Node,
        moveNode:cc.Node,
    },

    start () {
        this.isOpen = false;
    },

    AppClick()
    {
        if(this.isOpen == false)
        {
            var m = cc.moveBy(0.3,cc.v2(595,0));
            this.moveNode.runAction(m);
            this.isOpen = true;
            this.BtnAppList.getComponent(cc.Sprite).spriteFrame = this.BtnAppListSprite[0];
            this.Mask.active = true;
        }
        else
        {
            var m = cc.moveBy(0.3,cc.v2(-595,0));
            this.moveNode.runAction(m);
            this.isOpen = false;
            this.BtnAppList.getComponent(cc.Sprite).spriteFrame = this.BtnAppListSprite[1];
            this.Mask.active = false;
        }
    },
    ShowItem(AppIDInfoList,Applength)
    {
        var leftLenght = this.LeftAppNodeList.children.length;
        var appitem = this.LeftAppNodeList.children[0];
        for(var i = 0;i < Applength;i++)
        {
            if(Applength == i)
            {
                if(leftLenght > i)
                {
                    var lastItem = this.LeftAppNodeList.children[i];
                }
                else
                {
                    var lastItem = cc.instantiate(this.LeftAppNodeList.children[0]);
                    lastItem.parent = this.LeftAppNodeList;
                }
                lastItem.active = true;
                lastItem.getComponent("AppItem").set222Touch();
                break;
            }

            if(leftLenght > i)
            {
                this.LeftAppNodeList.children[i].getComponent("AppItem").setItem(AppIDInfoList[i]);
            }
            else
            {
                var newitem = cc.instantiate(appitem);
                newitem.parent = this.LeftAppNodeList;
                newitem.getComponent("AppItem").setItem(AppIDInfoList[i]);
            }
        }
        var reallength = Applength+1;
        var vv = reallength/3;
        if(reallength%3>0)
        {
            vv++;
        }
        this.LeftAppNodeList.height = (130 + 30) * vv + 20;
        this.ScrollView.scrollToTop(0);
    }
});
