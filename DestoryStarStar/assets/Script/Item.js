var Effect = require("Effect");
var FactoryItem = require("FactoryItem");
var SoundManage = require("SoundManage");

cc.Class({
    extends: cc.Component,

    properties: {
        Horizontal:10,
        Vertical:10,   
        LightUI:cc.Node,
        BoxUI:cc.Node,

        _isHasBox:false,
        _OtherItemList:[],
        _ID:-1,
        _ColorType: -1,
        _isDestory: false,
        _isAlreadyDetection: false,
    },

    Clear()
    {
        this._OtherItemList.length = 0;
        this._ID = -1;
        this._ColorType = -1;
        this._isDestory = false;
        this._isAlreadyDetection = false;
        this.node.active = false;
        this._isSplice = false;
        this.isTouch = false;
    },

    start () {
        this.isTouch = false;
        //this.ItemList = FactoryItem.Instance.ItemParent.children;
        this.node.on(cc.Node.EventType.TOUCH_START,()=>{
           this.ItemClick();
        },this);

    },

    ItemClick()
    {
        var self = this;
        if(FactoryItem.Instance._IsTouch&&FactoryItem.Instance.IsGameStart)
        {
            FactoryItem.Instance.StopPromptAnimation();
            switch(FactoryItem.Instance._TouchState)
            {
                case "":
                    self.TouchNormal(self);
                    break;
                case "1":
                    self.TouchHammer(self.node);
                    break;
                case "2":
                    self.TouchChange(self.node);
                    break;
            }   
        }
    },

    TouchNormal(self)
    {
        FactoryItem.Instance._IsTouch = false;
        var s1 = cc.scaleTo(0.05,0.8);
        var s2 = cc.scaleTo(0.05,1);
        var call = cc.callFunc(function(){
            self.FindSameItem(true);
        }.bind(self));
        self.node.runAction(cc.sequence(s1,s2,call));
    },

    TouchHammer(item)
    {
        FactoryItem.Instance.HammerProps(item);
        FactoryItem.Instance._TouchState = "";
        if(FactoryItem.Instance.GameInitCom.PopsList.Hammer>0)
        {
            FactoryItem.Instance.UIMianCom.UserHammerProps();
        }
        else
        {
            FactoryItem.Instance.UIMianCom.UserDiamond();
        }
    },

    TouchChange(item)
    {
        FactoryItem.Instance.ChangeProps(item);
    },

//得到上下左右
    GetLUDR(IshasMyself = true)
    {
        this.LUDRList = [];

        this.ItemList =  FactoryItem.Instance.allVerticalList;
        var _itemList = [];
        for(var key in this.ItemList)
        {
            if(this.ItemList[key] != null)
            {
                _itemList.push(this.ItemList[key]);
            }
        }

        for(var i = 0;i < _itemList.length;i++)
        {
            for(var j = 0;j<_itemList[i].length;j++)
            {
                if(_itemList[i][j] == this.node)
                {
                    if(IshasMyself)
                    {
                        this.LUDRList.push(this.node);
                    }
                    if(i-1>=0)
                    {
                        var left = _itemList[i-1][j];
                        if(left!=null)
                            this.LUDRList.push(left);
                    }
                    if(_itemList.length>i+1)
                    {
                        var Right = _itemList[i+1][j]; 
                        if(Right!=null)
                            this.LUDRList.push(Right);
                    }
                    if(j-1>=0)
                    {
                        var Up = _itemList[i][j-1];
                        if(Up!=null)
                            this.LUDRList.push(Up);
                    }
                    
                    if(_itemList[i].length>j+1)
                    {
                        var Down = _itemList[i][j+1];
                        if(Down!=null)
                        {
                            this.LUDRList.push(Down);
                        }
                    }
                }
            }
        }
    },

    FindSameItem(IsMianItem = false)
    {
        if(FactoryItem.Instance.IsGameStart == false)
            return;
        this.GetLUDR();
        for(var i = 0;i<this.LUDRList.length;i++)
        {
            var ItemCom = this.LUDRList[i].getComponent("Item");
            if(ItemCom._ColorType == this._ColorType)
            {
                var count = FactoryItem.Instance.AddCheckItem(this.LUDRList[i]);
                if(count >= 2)
                {
                    ItemCom.FindSameItem();
                }
            }
        }
        
        if(IsMianItem)
        {
            if(FactoryItem.Instance._CheckItem.length>=2)
            {
                FactoryItem.Instance._IsTouch = true;
            
                FactoryItem.Instance.ClearCheckItem();
            }
            else
            {
                FactoryItem.Instance.ClearCheckLight();
            }
        }
        
    },


    GetRayPos()
    {
        var p1 = this.node.getPosition();
        var UpP = cc.v2(p1.x,p1.y + 75);
        var DownP = cc.v2(p1.x,p1.y - 75);
        var leftp = cc.v2(p1.x - 75,p1.y );
        var RightP = cc.v2(p1.x + 75,p1.y );
        var P2List = [UpP,DownP,leftp,RightP];
        return P2List;
    },

    /*
    FindSameItem(IsMianItem = false)
    {
        if(FactoryItem.Instance.IsGameStart == false)
            return;
        var p1 = this.node.getPosition();
        var P2List = this.GetRayPos();
        for(var i = 0;i<P2List.length;i++)
        {   
            var output = cc.director.getPhysicsManager().rayCast(p1, P2List[i], cc.RayCastType.Any);
           
            if(output.length>0)
            {
                var OtherColor = output[0].collider.getComponent("Item")._ColorType;
                
                if(OtherColor==this._ColorType)
                {
                    FactoryItem.Instance._IsTouch = false;
                    if(!FactoryItem.Instance.AddCheckItem(output[0].collider.node))
                    {
                        output[0].collider.node.getComponent("Item").FindSameItem();
                    }
                }
                else
                {
                    continue;
                }
            }
            else
            {
                continue;
            }
        }

        if(IsMianItem)
        {
            FactoryItem.Instance.ClearCheckItem();
        }
        return;
    },
    */
    //检查相同的Item
    detectionSameItem(IsMianItem = true,isOnlydetection = false)
    {
        if(FactoryItem.Instance.IsGameStart == false)
            return;
        this.GetLUDR(false);
        for(var i = 0;i<this.LUDRList.length;i++)
        {
            var ItemCom = this.LUDRList[i].getComponent("Item");
            if(ItemCom._ColorType == this._ColorType)
            {
                if(isOnlydetection&&this.LUDRList[i] != this.node)
                {
                    return false;
                }
                if(!FactoryItem.Instance.AddMaxItem(this.LUDRList[i]))
                {
                    ItemCom.detectionSameItem(false);
                }
            }
        }
        if(IsMianItem)
        {
            FactoryItem.Instance.CompareItemList();
        }
       
    },
  
    //提示星星的动画
    PromptAnimation()
    {
        var s1 = cc.scaleTo(0.5,0.8);
        var s2 = cc.scaleTo(0.5,1);
        var forever = cc.repeatForever(cc.sequence(s1,s2));
        forever.setTag(1);
        this.node.runAction(forever);
    },
    //停止提示星星的动画
    StopPromptAnimation()
    {
        this.node.stopActionByTag(1);
        this.node.setScale(1);
    },

    //游戏开始移动动画
    StarGameMove(dis,index,itemParent)
    { 
        if(index<-1)
            return;
        var nextItem = itemParent[index-1];
        index--;
        var move = cc.moveBy(0.1,cc.v2(0,-dis));
        this.node.runAction(move);
        this.scheduleOnce(function(){
            if(nextItem!=null)
            {
                nextItem.getComponent("Item").StarGameMove(dis,index,itemParent);
            }
        },0.0005);
    },

    //星星消失动画
    PlayDestoryAnimation(isplayEffect = true)
    {
        FactoryItem.Instance._IsTouch = false;
        SoundManage.Instance.playDestoryStar();
        if(isplayEffect)
        {
            Effect.Instance.PlayStarEffect(this.node.getPosition(),this._ColorType); 
        }
        this.node.active = false;
        /* 
        var s =  cc.scaleBy(0.2,0.2);
        var c =  cc.callFunc(function(){
            this.node.active = false;
        }.bind(this));
        var sqe = cc.sequence(s,c);
        this.node.runAction(c);
        */
    },

    ShowLight()
    {
        this.LightUI.active = true;
    },

    HideLight()
    {
        this.LightUI.active = false;
        this.BoxUI.active = false;
        this._isHasBox  = false;
    },

    ShowBox()
    {
        this.BoxUI.active = true;
        this._isHasBox = true;
    },

   
});
