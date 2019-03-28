var FlyUI = require("FlyUI");

var FileServe = require("FileServe");

var UIManage = require("UIManage");

var SoundManage = require("SoundManage");

var FactoryItem =  cc.Class({
    extends: cc.Component,

    statics:
    {
        Instance:null
    },

    properties: {
        ItemPrefabs: cc.Prefab,
        ItemParent:cc.Node,
        ColorList:
        {
            type: cc.SpriteFrame,
            default: []
        },
        across : 10,

        UIMian : cc.Node,
        
        _CheckItem:[], //选中的Item
        _DetectionItem:[],
        _ItemMaxList:[],//当前收益最大的数组 
        _PromptCoolTime:5,
        _IsTouch:true,

        _StartMoveDis: 300,
        _TouchState: "", //道具状态 ""：正常 "1"：锤子 "2":...
        _index:0
    },

    Clear()
    {
        this.StopPromptAnimation();
        this.isdeath = false;
        this.isPutCanDesing = false; //玩家输入且可以消除  
        this.allVerticalList = new Array();
        this._TouchState = "";
        this._CheckItem.length = 0;
        this.isReset = false;
        this._IsTouch = true;
        for(var i = 0;i<this.ItemParent.children.length;i++)
        {
            this.ItemParent.children[i].getComponent("Item").Clear();
        }
    },

    onLoad()
    {
        FactoryItem.Instance = this;
        this.GameInitCom = cc.find("Canvas").getComponent("GameInit");
        this.ItemParent = cc.find("ItemParent");
        this.loadItem();
        this._StartMoveDis= 1000; 
        this.allVerticalList = new Array(); //统计数列的数组
        this.isRunMax = true;
        this.isdeath = false;
        this.IsGameStart = false;
        this.isGameOver = false;
        this.isReset = false;
        //this.isResurtTimes = 3;
        this.constCoolTime = 3;
        this._PromptCoolTime = this.constCoolTime;
        this.isPutCanDesing = false; //玩家输入且可以消除
        this.UIMianCom = this.UIMian.getComponent('UIMian');
        FlyUI.Instance.UIMian = this.UIMian;
    },



    start () {
        this.Disx = 72;
        this.Disy = 73;
        this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },

    loadItem()
    {
        for(var i = 0;i < 100;i++)
        {
            var item =  cc.instantiate(this.ItemPrefabs);
            item.parent = this.ItemParent;
            item.active = false;
        }
    },

    GetDis()
    {
        //清理Gc
        if(CC_WECHATGAME)
        {
            wx.triggerGC();
        }
        var self = this;
        this.scheduleOnce(function(){
            self.IsGameStart = true;  
            self._IsTouch = true;
            self._PromptCoolTime = self.constCoolTime;
            self._CheckItem.length = 0;
            //self.ChildrenRankCom.ShowOne();
        },1.5);
        this.isGameOver = false;

    },

    CreatItem(pos,num,index)
    {   
        var item = this.ItemParent.children.length==100? this.ItemParent.children[num]:cc.instantiate(this.ItemPrefabs);
        item.active = true;
        item.setPosition(cc.v2(pos.x,pos.y + this._StartMoveDis));

        item.setScale(1);
        item.parent = this.ItemParent;
        var ItemCom =  item.getComponent("Item");
        ItemCom._ColorType = index;
        ItemCom._ID = num+1;
        ItemCom._isDestory = false;
        item.getComponent(cc.Sprite).spriteFrame = this.ColorList[index];
        ItemCom.HideLight();
        this.allocationVertical(num,item);
        return item;
    },

    CacheCreatItem(pos,num,_ColorType,_isDestory,_isHasBox)
    {
        var item = this.ItemParent.children.length==100? this.ItemParent.children[num]:cc.instantiate(this.ItemPrefabs);
        item.setPosition(cc.v2(pos.x,pos.y + this._StartMoveDis));
        item.setScale(1);
        item.parent = this.ItemParent;
        var index = _ColorType;
        var ItemCom = item.getComponent("Item");
        ItemCom._ColorType = index;
        ItemCom._ID = num+1;
        item.getComponent(cc.Sprite).spriteFrame = this.ColorList[index];
        ItemCom._isDestory = _isDestory;
        ItemCom.HideLight();
        if(_isHasBox)
        {
            ItemCom.ShowBox();
        }
        this.allocationVertical(num,item);
        return item;
    }, 
    
    //重置后分配数列
    RestAllocationVertical()
    {
        var LoactionPosCache = FileServe.Instance.getLoactionPosCache();
        if(LoactionPosCache==null) 
            return;
        this.allVerticalList = new Array();
        for(var key in LoactionPosCache)
        {
            this.allVerticalList[key] = [];
            for(var i = 0;i<LoactionPosCache.length;i++)
            {
                var num = LoactionPosCache[key][i]-1;
                var valueItem = this.ItemParent.children[num];
                if(valueItem.getComponent("Item")._isDestory == false)
                {
                    this.allVerticalList[key].push(valueItem);
                }
            }
        }
    },  

//分配竖列 
    allocationVertical(num,myItem)
    {
        var myItemCom = myItem.getComponent("Item");
        if(myItemCom._isDestory)
            return;
        var index = (num+1)%this.across;
        if(this.allVerticalList.length == 0)
        {
            for(var i = 0;i<this.across;i++)
            {
                var _list = [];
                this.allVerticalList[i] = _list;
            }
        }
        for(var key in this.allVerticalList)
        {
            var _index = index == 0?9:index-1;
            if(key == _index)
            {
                this.allVerticalList[key].push(myItem);
            }
        }
    },

    setItemXY()
    {
        for(var key in this.allVerticalList)
        {
            for(var i = 0;i<this.allVerticalList[key].length;i++)
            {
                this.allVerticalList[key][i].getComponent("Item").setXY(Number(key),i);
            }
        }
    },

    test()
    {
        var indexlist = [];
        var index = -1;
        for(var key in this.allVerticalList)
        {
            index ++;
            if(this.allVerticalList[key].length == 0)
            {
                indexlist.push(index);
            }
        }
        for(var i = 0; i< indexlist.length;i++)
        {
            this.allVerticalList.splice(indexlist[i]-i,1);
        }
        this.setItemXY();
        /*
        for(var key in this.allVerticalList)
        {
            for(var i = this.allVerticalList[key].length-1;i>=0;i--)
            {
                if(this.allVerticalList[key][i].getComponent("Item")._isDestory)
                {
                    this.allVerticalList[key].splice(i,1);
                }
            }
            if(this.allVerticalList[key] != null && this.allVerticalList[key].length == 0)
            {
                this.allVerticalList[key] = null
            }
        }
        */
    },

    AddCheckItem(checkItem,isAnimation = true)
    {
        var Ishas = -1;
        for(var i = 0;i<this._CheckItem.length;i++)
        {
            if(checkItem == this._CheckItem[i])
            {
                return Ishas;
            }
        }
        
        checkItem.getComponent("Item").ShowLight();
        this._CheckItem.push(checkItem);
        if(isAnimation)
        {
            var checkItemCom = checkItem.getComponent("Item");
            checkItemCom._isDestory = true;
        }

        return this._CheckItem.length;
    },

    AddMaxItem(checkItem)
    {
        var Ishas = false;
        for(var i = 0;i<this._DetectionItem.length;i++)
        {
            if(checkItem == this._DetectionItem[i])
            {
                Ishas = true;
            }
        }
        if(!Ishas)
        {
            this._DetectionItem.push(checkItem);
            checkItem.getComponent("Item")._isAlreadyDetection = true;
        }
        return Ishas;
    },

    CompareItemList()
    {
        if(this._DetectionItem.length != 0)
        {
            if(this._DetectionItem.length > this._ItemMaxList.length)
            {
                this._ItemMaxList.length = 0;
                for(var i = 0;i<this._DetectionItem.length;i++)
                {
                    this._ItemMaxList.push(this._DetectionItem[i]);
                }
            }
            this._DetectionItem.length = 0;
        }
        
    },

    ClearCheckItem(IsSetValue = -1)
    {
        var self = this;
        this.unscheduleAllCallbacks();
        var count = this._CheckItem.length-1;
        var index = -1;
        this.schedule(function(){
            index ++;
            if(index<self._CheckItem.length)
            {
                self._CheckItem[index].getComponent("Item").PlayDestoryAnimation();
               
                if(IsSetValue == -1)
                {
                    var addScore = 5+10*index;
                }
                else
                {   
                    var addScore = 10;
                }
                FlyUI.Instance.CreatorScoreFly(self._CheckItem[index].getPosition(),this.UIMian.getComponent("UIMian").ScoreUIPos,addScore);
                
                if(index == count)
                {
                    if(IsSetValue == -1)
                    {
                        self.ShowPromptUI(false);
                    }
                    else
                    {
                        self.ShowPromptUI(true);
                    }
                    self.GetColorEgg();
                    self.ClearCheckItem2();
                }
            }
           
        },0.02,count,0);
       
    },

    ShowPromptUI(isSkill = false)
    {
        var lengths = this._CheckItem.length;
        
        this.UIMianCom.ShowGetScoreUI(lengths,isSkill);
        
        var value = lengths-5;

        if(value >= 4 )
        {
            value = 3;
        }
        if(value>=0)
        {
            this.UIMianCom.UIPromptStar.getComponent("UIPromptStar").PlayUI(value);
            SoundManage.Instance.playPromptSound(value);
        }
    },
    
    //每组结算生产彩蛋
    GetColorEgg()
    {
        var ColorEggState = "";
        for(var i = 0;i<this._CheckItem.length;i++)
        {
            if(this._CheckItem[i].getComponent("Item")._isHasBox)
            {
                UIManage.Instance.ShowGetBoxUI();
                ColorEggState = "Box"; 
                break;
            }
        }
        
        //if(this.UIMianCom._PlayInfo._Level == 1)
        //   return;
        
        if(CC_WECHATGAME)
        {
            if(ColorEggState == ""&&this._CheckItem.length >=5&& this.ChildrenRankCom.playInfo._is_status == 1&&this.ChildrenRankCom.playInfo.count<9)
            {
                var value1 = Math.floor(Math.random()*100);
                if(value1<20)
                {
                    UIManage.Instance.ShowGetMoney(); //红包UI
                    ColorEggState = "Money";  
                }
            }
        }

        if(ColorEggState == ""&& this.UIMianCom._PlayInfo._IsShowSkill == false)
        {
            var value = Math.floor(Math.random()*100);
            if(value<2)
            {
                this.UIMianCom._PlayInfo._IsShowSkill = true;
                UIManage.Instance.ShowGetSkill();//消灭同种颜色技能UI
                ColorEggState = "Skill";
            }
        }
        
    },

    ClearCheckLight()
    {   
        for(var i = 0;i< this._CheckItem.length;i++)
        {
            var itemComm = this._CheckItem[i].getComponent("Item");
            itemComm.LightUI.active = false;
            itemComm._isDestory = false;
        }
        this._CheckItem.length = 0;
        this._IsTouch = true;
    },

    ClearCheckItem2()
    {
        for(var key in this.allVerticalList)
        {
            var step = 0; 
            if(this.allVerticalList[key] == null)
                continue;
            var indexlist = [];
            for(var i = 0;i<this.allVerticalList[key].length;i++)
            {
                var _Item = this.allVerticalList[key][i].getComponent("Item");
                if(_Item._isDestory)
                {
                    step++;
                    indexlist.push(i); 
                    //this.allVerticalList[key].splice(i,1);
                }
                else if(step>0)
                {
                    this.MoveDownItem(step,this.allVerticalList[key][i]);
                }
            }
            for(var i = 0; i< indexlist.length;i++)
            {
                this.allVerticalList[key].splice(indexlist[i]-i,1);
            }
        }
        var self = this;
        this.scheduleOnce(function() {
            var isleftAni = self.LeftClear();
            var timer = isleftAni==true?0.1:0
            
            self.scheduleOnce(function() {
                self.IsPass();
                self.IsDeath();
                self.UIMianCom.UpdateFreindRank();
                self._IsTouch = true;
                
            }, timer);

        }, 0.4);
        
        this._CheckItem.length = 0;
    },

    IsPass()
    {
        if(this.UIMianCom._PlayInfo._IsShowPass == false &&this.UIMianCom.IsPass())
        {
            this.UIMianCom._PlayInfo._IsShowPass = true;
            this.UIMianCom.UIPromptStar.getComponent("UIPromptStar").Pass();
            SoundManage.Instance.playPassSound();
        }
    },

    LeftClear()
    {
        var isleftAni = false;
        var leftstep = 0;
        var index = -1;
        var indexlist = [];
        for(var _key1 in this.allVerticalList)
         {
             index++;
             if(this.allVerticalList[_key1] != null && this.allVerticalList[_key1].length == 0)
             {
                leftstep++;
                this.allVerticalList[_key1] = null;
                indexlist.push(index);
             }
             else if(leftstep >0&&this.allVerticalList[_key1] !=null)
             {
                for(var i = 0; i<this.allVerticalList[_key1].length;i++)
                {
                    this.MoveleftItem(leftstep,this.allVerticalList[_key1][i]);
                    if(!isleftAni)
                        isleftAni = true;
                }
             }
         }
         for(var i = 0; i< indexlist.length;i++)
         {
             this.allVerticalList.splice(indexlist[i]-i,1);
         }
         return isleftAni;
    },
    MoveDownItem(step,item)
    {
        item.getComponent("Item")._Y -= step;
        var pos = item.getPosition();
        var  numx = Number(pos.x.toFixed(1));
        var  numy = Number(pos.y.toFixed(1));
        var targetPos = cc.v2(numx,numy-this.Disy*step);
        
        var move =  cc.moveTo(0.15,targetPos);
        var move1 = cc.moveBy(0.1,cc.v2(0,20));
        var move2 = cc.moveBy(0.05,cc.v2(0,-20));
        
        item.runAction(cc.sequence(move,move1,move2));
    },
    MoveleftItem(step,item)
    {
        item.getComponent("Item")._X -= step;
        var pos = item.getPosition();
        var  numx = Number(pos.x.toFixed(1));
        var  numy = Number(pos.y.toFixed(1));
        var targetPos = cc.v2(numx-this.Disx*step,numy);

        //item.getComponent("Item")._ID - step;
        var move =  cc.moveTo(0.1,targetPos);
       
        item.runAction(move);
    },

    IsDeath()
    {
        if(this.isPutCanDesing&&this.IsGameStart == false)
        {
            return;
        }
        var isdeath = true;
        for(var i = 0;i < this.ItemParent.children.length;i++)
        {
            var ItemCom = this.ItemParent.children[i].getComponent("Item");
            if(ItemCom._isDestory == false)
            {
                isdeath = ItemCom.detectionSameItem(true,true);
                if(isdeath == false)
                {
                    break;
                }
            }
        }
        if(isdeath != false)
        {
            this.IsGameStart = false;
            this.isReset = false;
            var surplusList = [];
            var itemchildren = this.ItemParent.children
            for(var i = 0; i<itemchildren.length;i++)
            {
                if(itemchildren[i].getComponent("Item")._isDestory == false)
                {
                    surplusList.push(itemchildren[i]);
                }   
            }
            var count = surplusList.length ;
           
            if(count>0)
            {
               
                this.scheduleOnce(function()
                {
                    for(var i = 0;i<count;i++)
                    {
                        var action = cc.blink(0.8, 2);
                        surplusList[i].getComponent("Item").ShowLight();
                        surplusList[i].runAction(action);
                    }
                    var index = -1;
                    var self = this;
                    //显示剩余方块 最高奖励分
                    this.UIMianCom.ShowRemian(2000,count);
                    this.schedule(function()
                    {
                        index++;
                        var scoreValue = 2000-(index+1)*(index+1)*20;
                        if(scoreValue<0)
                        {
                            scoreValue = 0;
                        }
                        self.UIMianCom.ShowRemian(scoreValue,count);
                        surplusList[index].getComponent("Item").PlayDestoryAnimation();
                        surplusList[index].getComponent("Item")._isDestory = true;
                        
                        if(index == count-1)
                        {
                            if(count<10)
                            {
                                var value = 2000-count*count*20;
                                
                                //self.UIMianCom.setLableUI(value);
                                //UI动画 todo
                            }
                            else
                            {
                                var value = 0;
                            }
                            self.scheduleOnce(
                                function()
                                {
                                    self.UIMianCom.AddRemianScore(value,()=>
                                    {
                                        //self.UIMianCom.IsSuccess();
                                        self.UIMianCom.NextLevel();
                                        
                                        self.UIMianCom.HideRemian();
                                    });
                                   
                                },1.2
                            );
                        }
                    },0.04,count-1,1);
                },0.5);
            }
            else
            {
                var self = this;
                this.UIMianCom.ShowRemian(2000,count);
                this.scheduleOnce(function()
                {
                    //this.UIMianCom.setLableUI(2000);
                    self.UIMianCom.AddRemianScore(2000,()=>
                    {
                        //this.UIMianCom.IsSuccess();
                        self.UIMianCom.NextLevel();
                        self.UIMianCom.HideRemian();
                    });
                   
                },1);
            }
        }
       
    },
//提示场景中最大的数组
    GetMaxItem()
    {
        for(var i = 0;i < this.ItemParent.children.length;i++)
        {
            var ItemCom = this.ItemParent.children[i].getComponent("Item");
            if(ItemCom._isDestory == false)
            {
                if(ItemCom._isAlreadyDetection)
                {
                    ItemCom._isAlreadyDetection = false;
                    continue;
                }
                ItemCom.detectionSameItem();
            }
        }
    
        for(var j = 0;j < this._ItemMaxList.length;j++)
        {
            //提示星星动画
            this._ItemMaxList[j].getComponent("Item").PromptAnimation();
        }
        
    },

    StopPromptAnimation()
    {
        for(var j = 0;j < this._ItemMaxList.length;j++)
        {
            this._ItemMaxList[j].getComponent("Item").StopPromptAnimation();
        }
        this._PromptCoolTime = this.constCoolTime;
        this.isRunMax = true;
        this._ItemMaxList.length = 0;
        this._DetectionItem.length = 0;
    },

    Init()
    {
        this.GameInitCom.Init();
    },

    update(dt)
    {
        if(this.IsGameStart == false)
        {
            return;
        }
        this._PromptCoolTime-=dt;
        if(this._PromptCoolTime<=0)
        {
            if(this.isRunMax)
            {
                this.GetMaxItem();
                this.isRunMax = false;
            }
        }
    },

    //锤子道具
    HammerProps(Item)
    {
        this._CheckItem.push(Item);
        Item.getComponent("Item")._isDestory = true;
        this.ClearCheckItem();
        this.UIMianCom.CancelProps();
    },
    
    ShowItemLight(_ItemCom)
    {
        if(this.ItemLastCom!= undefined)
        {
            this.ItemLastCom.HideLight();
        }
        _ItemCom.ShowLight();
        this.ItemLastCom = _ItemCom;
    },

    //改变颜色道具
    ChangeProps(Item)
    {
        this.UIMianCom.UIProposChangePanel.getComponent("UIProposChangePanel").ShowUI(Item);
        //this.UIMianCom.CancelProps(false);
        this.ShowItemLight(Item.getComponent("Item"));
    },

     //重组道具
     PropsRest()
     {
        this.StopPromptAnimation();
        var IndexList = [];
        var Vlist = [];
        var VlistX = [];
        var KeyList = [];
        var _index = -1;
        for(var key in this.allVerticalList)
        {
            if(this.allVerticalList[key] != null)
            {
                _index++;
                Vlist.push(this.allVerticalList[key]);
                VlistX.push(this.allVerticalList[key][0].getPosition().x);
                IndexList.push(_index);
                KeyList.push(key);
            }
        }
        var alllist= {}
        for(var i = 0;i < Vlist.length;i++)
        {
            var value =  Math.floor(Math.random()*IndexList.length);
            var real =  IndexList[value];
            IndexList.splice(value,1);

            var posX = VlistX[i];

            alllist[i] =  Vlist[real];
            for(var j = 0;j<Vlist[real].length;j++)
            {
                var startPOS =  Vlist[real][j].getPosition();
                
                Vlist[real][j].setPosition(cc.v2(posX,startPOS.y));
            }
        }
        var _i = -1;
        for(var key in this.allVerticalList)
        {
            _i++;
            if(alllist[_i] != undefined)
            {
                this.allVerticalList[key] = alllist[_i];
                for(var j = 0;j<this.allVerticalList[key].length;j++)
                {
                    var Item = this.allVerticalList[key][j];
                    var ItemCom = Item.getComponent("Item");
                   
                    if(!ItemCom._isDestory)
                    {
                        var Indexs = Math.floor(Math.random()*5);
                        Item.getComponent(cc.Sprite).spriteFrame = this.ColorList[Indexs];
                        ItemCom._ColorType = Indexs;
                        var keyValue = Number(key)+1;
                    }
                }
            }
            else
            {
                this.allVerticalList[key] = null;
            }
        }
        this.setItemXY();
        this.isReset = true;
        this.IsDeath();
     },
     
     //消除同一个颜色道具
     DestorySameColorProps()
     {
        this.StopPromptAnimation();
        var colorType = -1;
        for(var i = 0;i<this.ItemParent.children.length;i++)
        {
            var Item = this.ItemParent.children[i];
            if(!Item.getComponent("Item")._isDestory)
            {
                if(colorType == -1)
                {
                    colorType = Item.getComponent("Item")._ColorType;
                }
                if(Item.getComponent("Item")._ColorType == colorType)
                {
                    this._CheckItem.push(Item);
                    Item.getComponent("Item")._isDestory = true;
                }
            }
        }
        this.ClearCheckItem(10);   
     },
     //缓存
     Cache()
     {
        if(this.IsGameStart&&this._IsTouch)
        {
            FileServe.Instance.StartItemCache();//储存关卡数和Item的位置
        }
        else
        {
            FileServe.Instance.SetPlayInfoCache();//只存关卡数
        }
     },
     //删除缓存
     RemoveCache()
     {
        FileServe.Instance.DestoryItemPlayCache();
     }
});
