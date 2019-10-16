var FactoryItem = require("FactoryItem");

cc.Class({
    extends: cc.Component,

    properties: {
       UIItem:
       {
           type:cc.Sprite,
           default:[],
       }
    },

  
    start () {
        var self = this;
      
       
        this.UIItem[0].node.on(cc.Node.EventType.TOUCH_START, function(event)
        {
            self.EventUI(0);
        });
        this.UIItem[1].node.on(cc.Node.EventType.TOUCH_START, function(event)
        {
            self.EventUI(1);
        });
        this.UIItem[2].node.on(cc.Node.EventType.TOUCH_START, function(event)
        {
            self.EventUI(2);
        });
        this.UIItem[3].node.on(cc.Node.EventType.TOUCH_START, function(event)
        {
            self.EventUI(3);
        });
    },

    EventUI(index)
    {
        this.Item.getComponent(cc.Sprite).spriteFrame = this.UIItem[index].spriteFrame;
        this.Item.getComponent("Item")._ColorType = this.UIItem[index].node.m_ID;
        this.node.active = false;
        FactoryItem.Instance._TouchState = "";
        if(FactoryItem.Instance.GameInitCom.PopsList.Change>0)
        {
            FactoryItem.Instance.UIMianCom.UserChange();
        }
        else
        {
            FactoryItem.Instance.UIMianCom.UserDiamond();
        }
        FactoryItem.Instance.UIMianCom.CancelProps();
    },

    CloseBtn()
    {
        //this.node.active = false;
        //FactoryItem.Instance._TouchState = "";
        FactoryItem.Instance.UIMianCom.CancelProps();
    },

    ShowUI(Item)
    {
        this.Item = Item;
        var colorType = Item.getComponent("Item")._ColorType;
        var ImgList = FactoryItem.Instance.ColorList;
        var index = -1;
        for(var i = 0;i<ImgList.length;i++)  
        {
            if(colorType == i)
            {
                continue;
            }
            index++;
            this.UIItem[index].spriteFrame = ImgList[i];
            this.UIItem[index].node.m_ID = i;
        }
        var pos = Item.convertToWorldSpaceAR(cc.v2(-375,-677));
        if(pos.x>160)
        {
            pos.x= 160;
        }
        else if(pos.x < -160)
        {
            pos.x = -160;
        }
        pos.y += 100;
        this.node.setPosition(pos);
        this.node.active = true;
    },
    
   

});
