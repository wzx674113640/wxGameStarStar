var FactoryItem = require("FactoryItem");
var FileServe = require("FileServe");
var UIManage = require("UIManage");
var ShareAndVideo = require("ShareAndVideo");

var PopsInfo = require("PopsInfo");
cc.Class({
    extends: cc.Component,

    properties: {
        ItemLayout: cc.Node,
        MyBg:cc.Node,
    },
    
   
    start () {
       
        this.Disx = 72;
        this.Disy = 73;

        let sysInfo = cc.view.getVisibleSize();
        let width = sysInfo.width;
        let height = sysInfo.height;
        var value = width/height;
        this.MyBg.width = width + (80*value);
        this.MyBg.height = height + 80;
        
        this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },

    //获取玩家道具数据
    getPopsInfo()
    {
        this.PopsList = new PopsInfo();
       var cList =  FileServe.Instance.getPopsCache();
       if(cList != null)
       {
           this.PopsList.Diamond = cList.Diamond;

           /*
           this.PopsList.Hammer = cList.Hammer;
           this.PopsList.Reset = cList.Reset;
           this.PopsList.Change = cList.Change;
           */

           if(FileServe.Instance.IsPassDay())
           {
                this.PopsList.Hammer = 0;
                this.PopsList.Reset = 0;
                this.PopsList.Change = 0;
                cc.sys.localStorage.setItem("TimeGift","1");
           }
           else
           {
                this.PopsList.Hammer = cList.Hammer;
                this.PopsList.Reset = cList.Reset;
                this.PopsList.Change = cList.Change;
           }
       }
       else
       {
            FileServe.Instance.IsPassDay();
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
        ShareAndVideo.Instance.ShowPanelMask();
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
        ShareAndVideo.Instance.HidePanelMask(0);
    },
    

    Init(isEasy = false)
    {
        FactoryItem.Instance.IsGameStart = false;
        FactoryItem.Instance.UIMianCom.BarScore.progress = 0;
        FactoryItem.Instance.UIMianCom.StartAnimation(()=>
        {
            var ItemlayoutChildren = this.ItemLayout.children;
            FactoryItem.Instance.allVerticalList = new Array();
            var WeightIndex = Math.floor(Math.random()*4);
            
            var value = Math.floor(Math.random()*100);
            if(value<40)
            {
                var index1 = Math.floor(Math.random()*100);
            }

            for(var i = 99;i>=0;i--)
            {
                var worldPos1 = ItemlayoutChildren[i].convertToWorldSpaceAR(cc.v2(0,0));
                
                var  numx = Number(worldPos1.x.toFixed(1));
                var  numy = Number(worldPos1.y.toFixed(1));
                var worldPos = cc.v2(numx,numy);
                
                var index = this.LevelDiffcultValue(WeightIndex,isEasy);
                var Item =  FactoryItem.Instance.CreatItem(worldPos,i,index);
                var ItemCom = Item.getComponent("Item");
                ItemCom._Leftstep = 0;
                ItemCom._isAlreadyDetection = false;
                ItemCom.IsGameStart = false;
                ItemCom._PromptCoolTime = FactoryItem.Instance.constCoolTime;
                
                //生成道具
                if(i == index1)
                {
                    ItemCom.ShowBox();
                }
                var time = 0.01*(100-i) + 0.1;
                var move = cc.moveTo(time,worldPos);
                Item.runAction(move);
            }
            FactoryItem.Instance.setItemXY();
            FactoryItem.Instance.GetDis();
        });
        
    },
    
    LevelDiffcultValue(WeightIndex,isEasy = false)
    {
        if(isEasy)
        {
            var DiffWeight = 0.25;
        }
        else
        {
            var DiffWeight = 0.1;
            var level = FactoryItem.Instance.UIMianCom._PlayInfo._Level;
            if(level<=10)
            {
                DiffWeight = 0.2;
            }
            else if(level>10&&level<=20)
            {
                DiffWeight = 0.15
            }
            else
            {
                DiffWeight = 0.1;
            }
        }
        if(WeightIndex == -1)
        {
            var index =  Math.floor(Math.random()*5);
        }
        else
        {
            var randomValue = Math.random()*1;
            if(randomValue<DiffWeight)
            {
                var index = WeightIndex;
            }
            else if(randomValue>=DiffWeight&&randomValue<2*DiffWeight)
            {
                var index= WeightIndex + 1;
            }
            else 
            {
                var index = Math.floor(Math.random()*5);
            }
        }
        return index;
    },

    CacheInit(cache)
    {
        var cache1 = cc.sys.localStorage.getItem("Vesion");
        var myVersion = this.ChildrenRankCom._version;
        if(cache1 == null||cache1 == "")
        {
            this.Init();
            cc.sys.localStorage.setItem("Vesion",myVersion)
        }
        else
        {
            if(Number(cache1) == myVersion)
            {
                
                FactoryItem.Instance.IsGameStart = false;
                var LayoutChildren = this.ItemLayout.children;
                FactoryItem.Instance.UIMianCom.StartAnimation(()=>
                {
                    for(var i = cache.length-1;i>=0;i--)
                    {
                        //var posx = cc.v2(cache[i].X,cache[i].Y);
                        if(cache[i]._X == undefined)
                        {
                            var posx = cc.v2(cache[i].X,cache[i].Y);
                        }
                        else
                        {
                            var index = (9-cache[i]._X) + cache[i]._Y * 10;
                            //var pos = LayoutChildren[index].getPosition();
                            var posx = LayoutChildren[99-index].convertToWorldSpaceAR(cc.v2(0,0));
                        }
                        var colorType = cache[i]._ColorType;
                        var _active = cache[i].active == 1? true:false;
                        var _isDestory = cache[i]._isDestory == 0? true:false;
                        var _isHasBox = cache[i]._isHasBox;
                        var Item =  FactoryItem.Instance.CacheCreatItem(posx,i,colorType,_isDestory,_isHasBox);
                        Item.active = _active;
        
                        var time  = 0.01*(100-i)+0.1;
                        var move = cc.moveTo(time,posx);
                       
                        Item.runAction(move);
        
                    }
                    FactoryItem.Instance.test();
                    FactoryItem.Instance.GetDis();
                });
            }
            else
            {
                this.Init();
                cc.sys.localStorage.setItem("Vesion",myVersion);
            }
        }
       
    }
    
});
