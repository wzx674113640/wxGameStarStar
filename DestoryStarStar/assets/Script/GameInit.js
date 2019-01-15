var FactoryItem = require("FactoryItem");
var FileServe = require("FileServe");
var UIManage = require("UIManage");

var PopsInfo = require("PopsInfo");
cc.Class({
    extends: cc.Component,

    properties: {
        ItemLayout: cc.Node,
        
    },
    firstInit()
    {
        this.realGamestart();
    },

    start () {
        //游戏开始入口
       
        //cc.director.getPhysicsManager().enabled = true;
        //cc.director.getPhysicsManager().gravity = cc.v2();
    },

    //获取玩家道具数据
    getPopsInfo()
    {
        this.PopsList = new PopsInfo();
       var cList =  FileServe.Instance.getPopsCache();
       if(cList != null)
       {
           this.PopsList.Diamond = cList.Diamond;
           this.PopsList.Hammer = cList.Hammer;
           this.PopsList.Reset = cList.Reset;
           this.PopsList.Change = cList.Change;
       }
       else
       {
           //新手礼包
           this.PopsList.Diamond = 50;
           this.PopsList.Hammer = 1;
           this.PopsList.Reset = 1;
       }
    },
    
   
    
    realGamestart()
    {
        var cache = FileServe.Instance.GetItemCache();
        var cache1 = FileServe.Instance.GetPlayInfo();
        if(cache != null||cache1!= null)
        {
            UIManage.Instance.ShowUIReadCache();
        }
        else
        {
            UIManage.Instance.ShowGameing();
            this.Init();
        }
    },
    
    GameStart(iscache)
    {
        UIManage.Instance.ShowGameing();
        if(iscache)
        {
            var value =  FileServe.Instance.GetItemCache();
            if(value == false||value ==null)
            {
                this.Init();
            }
            else
            {   
                this.CacheInit(value);
            }
        }
        else
        {
            this.Init();
        }
    },
    

    Init()
    {
        //FactoryItem.Instance.unscheduleAllCallbacks();
        //FactoryItem.Instance.UIMianCom.unscheduleAllCallbacks();
        FactoryItem.Instance.IsGameStart = false;
        FactoryItem.Instance.UIMianCom.BarScore.progress = 0;
        FactoryItem.Instance.UIMianCom.StartAnimation(()=>
        {
            var ItemlayoutChildren = this.ItemLayout.children;
            FactoryItem.Instance.allVerticalList = new Array();
            for(var i = 0;i<ItemlayoutChildren.length;i++)
            {
                var worldPos = ItemlayoutChildren[i].convertToWorldSpaceAR(cc.v2(0,0));
                //var worldPos =  ItemlayoutChildren[i].getPosition();
                var Item =  FactoryItem.Instance.CreatItem(worldPos,i);
                var ItemCom = Item.getComponent("Item");
                //ItemCom._ID = i+1;
                ItemCom._isDestory = false;
                ItemCom._Leftstep = 0;
                ItemCom._isAlreadyDetection = false;
                ItemCom.IsGameStart = false;
                ItemCom._PromptCoolTime = FactoryItem.Instance.constCoolTime;
                 
            }
            
            FactoryItem.Instance.GetDis();
        });
        
    },
    
    CacheInit(cache)
    {
        //FactoryItem.Instance.unscheduleAllCallbacks();
        //FactoryItem.Instance.UIMianCom.unscheduleAllCallbacks();
        //FactoryItem.Instance.UIMianCom.BarScore.progress = 0;
        FactoryItem.Instance.IsGameStart = false;
        FactoryItem.Instance.UIMianCom.StartAnimation(()=>
        {
            for(var i = 0;i<cache.length;i++)
            {
                var posx = cc.v2(cache[i].X,cache[i].Y);
                var colorType = cache[i]._ColorType;
                var _active = cache[i].active == 1? true:false;
                var _isDestory = cache[i]._isDestory == 0? true:false;
                var _isHasBox = cache[i]._isHasBox;
                var _ID = cache[i]._ID-1;
                var Item =  FactoryItem.Instance.CacheCreatItem(posx,i,colorType,_isDestory,_isHasBox);
                Item.active = _active;
            }
            //FactoryItem.Instance.UIMianCom.BarScore.progress = 0;
            FactoryItem.Instance.test();
            FactoryItem.Instance.GetDis(true);
        });
       
    }
    
});
