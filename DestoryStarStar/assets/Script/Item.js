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
        _isAlreadyDetection: false
    },

    Clear()
    {
        this._OtherItemList.length = 0;
        this._ID = -1;
        this._ColorType = -1;
        this._isDestory = false;
        this._isAlreadyDetection = false;
        this.node.active = false;
    },

    start () {

        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function(event)
        {
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
           
        });
    },

    TouchNormal(self)
    {
        var s1 = cc.scaleTo(0.05,0.9);
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

    FindSameItem(IsMianItem = false)
    {
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

    //检查相同的Item
    detectionSameItem(IsMianItem = true,isOnlydetection = false)
    {
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
                    if(isOnlydetection)
                    {
                        return false;
                    }
                    if(!FactoryItem.Instance.AddMaxItem(output[0].collider.node))
                    {
                        output[0].collider.node.getComponent("Item").detectionSameItem(false);
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
            FactoryItem.Instance.CompareItemList();
        }
        return ;
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
    PlayDestoryAnimation()
    {
        SoundManage.Instance.playDestoryStar();
        Effect.Instance.PlayStarEffect(this.node.getPosition(),this._ColorType); 
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
