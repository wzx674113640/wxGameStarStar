
var FileServe =  cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    statics:
    {
        Instance:null,
    },

    onLoad()
    {
        cc.game.setFrameRate(50);
        FileServe.Instance = this;
        this.GameInitCom = cc.find("Canvas").getComponent("GameInit");
        //this.GameInitCom.firstInit();
    },

    start () {
       
    },

    StartItemCache()
    {
        var FactoryItem = require("FactoryItem");
        var playList = {};
        var playerInfo = FactoryItem.Instance.UIMian.getComponent("UIMian")._PlayInfo;
        playList._LastNeedScore = playerInfo._LastNeedScore;
        playList._NeedScore = playerInfo._NeedScore;
        playList._Score = playerInfo._Score;
        playList._Level = playerInfo._Level;
        playList._LastScore = playerInfo._LastScore;
        playList._ID = playerInfo._ID;
        playList.IsGameStart = FactoryItem.Instance.IsGameStart;
        playList.isGameOver = FactoryItem.Instance.isGameOver;
        
        playList._IsShowPass =  playerInfo._IsShowPass;
        playList._IsResurtTimes =  playerInfo._IsResurtTimes;
        playList._IsShowSkill =  playerInfo._IsShowSkill;
      
        if(!FactoryItem.Instance.IsGameStart)
        {
            this.SetCachePlayInfo(playList,false);
            cc.sys.localStorage.setItem("ItemCacheList",false);
        }
        else
        {
            var ItemList =  FactoryItem.Instance.ItemParent.children;

            var ItemCacheList = [];
            
            for(var i = 0;i< 100;i++)
            {
                var ItemComm = ItemList[i].getComponent("Item")
                var ItemInfo = {};
                ItemInfo._ColorType = ItemComm._ColorType;
                var active = ItemList[i].active == true? 1:0;
                ItemInfo.active = active;
                ItemInfo._ID = ItemComm._ID;//****/
                var pos1 = ItemList[i].getPosition();
                 
                var  numx = Number(pos1.x.toFixed(1));
                var  numy = Number(pos1.y.toFixed(1));
                var pos = cc.v2(numx,numy);

                ItemInfo.X = pos.x;
                ItemInfo.Y = pos.y;
                ItemInfo._isHasBox = ItemComm._isHasBox;
                var isdestry = ItemComm._isDestory == true? 0:1; 
                ItemInfo._isDestory = isdestry;
                ItemCacheList.push(ItemInfo);
            }
            this.SetCachePlayInfo(playList,ItemCacheList);
            var ItemPos = JSON.stringify(ItemCacheList);
            cc.sys.localStorage.setItem("ItemCacheList",ItemPos);
        }   
      
        var playvalue = JSON.stringify(playList);
        cc.sys.localStorage.setItem("PlayInfo",playvalue);
    },

    SetPlayInfoCache()
    {
        var FactoryItem = require("FactoryItem");
        cc.sys.localStorage.setItem("ItemCacheList",false);
        var playList = {};
        var playerInfo = FactoryItem.Instance.UIMianCom._PlayInfo;
        playList._LastNeedScore = playerInfo._LastNeedScore;
        playList._NeedScore = playerInfo._NeedScore;
        playList._Score = playerInfo._LastScore;
        playList._Level = playerInfo._Level;
        playList._LastScore = playerInfo._LastScore;
        playList._ID = playerInfo._ID;
        playList.IsGameStart = FactoryItem.Instance.IsGameStart;
        playList.isGameOver = FactoryItem.Instance.isGameOver;

        playList._IsShowPass =  playerInfo._IsShowPass;
        playList._IsResurtTimes =  playerInfo._IsResurtTimes;
        playList._IsShowSkill =  playerInfo._IsShowSkill;

        this.SetCachePlayInfo(playList);
        var playvalue = JSON.stringify(playList);
        cc.sys.localStorage.setItem("PlayInfo",playvalue);
    },

    //储存三个玩家的最高纪录
    SetCachePlayInfo(playList,ItemCachePosList=false)
    {
        var value = cc.sys.localStorage.getItem("PlayInfoList");
        var ItemCachePos = cc.sys.localStorage.getItem("ItemCachePosList",ItemCachePosList)
        if(value == ""||value == null)
        {
            var cacheList = []; 
            cacheList.push(playList);
            var playvalue = JSON.stringify(cacheList);
            cc.sys.localStorage.setItem("PlayInfoList",playvalue);
            var cacheItemList = [];
            cacheItemList.push(ItemCachePosList);
            var ItemPosvalue = JSON.stringify(cacheItemList);
            
            cc.sys.localStorage.setItem("ItemCachePosList",ItemPosvalue);
        }
        else
        {
            var itemCachOne = JSON.parse(value);
            var ItemPos = JSON.parse(ItemCachePos);
            var ispush = true;
            for(var i=0; i<itemCachOne.length;i++)
            {
                if(itemCachOne[i]._ID == playList._ID)
                {
                    ispush = false;
                    if(playList._Score>=itemCachOne[i]._Score)
                    {
                        itemCachOne[i] = playList;
                        ItemPos[i] = ItemCachePosList;
                    }
                }   
            }
            if(ispush)
            {
                itemCachOne.push(playList);
                ItemPos.push(ItemCachePosList);
            }
            for(var i=0; i<itemCachOne.length;i++)
            {
                for(var j=i+1;j<itemCachOne.length;j++)
                {
                    if(itemCachOne[i]._Score<itemCachOne[j]._Score)
                    {
                        var temp = itemCachOne[i];
                        itemCachOne[i]=itemCachOne[j];
                        itemCachOne[j]=temp;
                        var temp1 = ItemPos[i];
                        ItemPos[i] = ItemPos[j];
                        ItemPos[j] = temp1;
                    }
                }
            }
            if(itemCachOne.length>3)
            {
                itemCachOne.pop();
                ItemPos.pop();
            }
            var playstring = JSON.stringify(itemCachOne);
            cc.sys.localStorage.setItem("PlayInfoList",playstring);
            var itemString = JSON.stringify(ItemPos)
            cc.sys.localStorage.setItem("ItemCachePosList",itemString);
        }
    },

    ReadCache(id)
    {
        var PlayInfoListStr = cc.sys.localStorage.getItem("PlayInfoList");
        var ItemCachePosListstr = cc.sys.localStorage.getItem("ItemCachePosList");
        var PlayInfoList = JSON.parse(PlayInfoListStr);
        var ItemCachePosList = JSON.parse(ItemCachePosListstr);
        var _playerInfo = PlayInfoList[id];
        var _ItemCachePos = ItemCachePosList[id];
        var _playerInfoStr = JSON.stringify(_playerInfo);
        var _ItemCachePosStr = JSON.stringify(_ItemCachePos);
        cc.sys.localStorage.setItem("ItemCacheList",_ItemCachePosStr);
        cc.sys.localStorage.setItem("PlayInfo",_playerInfoStr);
    },

    GetCachePlayInfo(index)
    {
        var value = cc.sys.localStorage.getItem("PlayInfoList");
        
        if(value ==""||value == null)
        {
            return false;
        }
        else
        {
            var itemCachOne = JSON.parse(value);
            if(itemCachOne.length>index)
            {
                return itemCachOne[index];
            }
            else
            {
                return false;
            }
        }
       
    },

    DestoryItemPlayCache()
    {
        this.SetPlayInfoCache();
        cc.sys.localStorage.removeItem("ItemCacheList");
        cc.sys.localStorage.removeItem("PlayInfo");
    },

    GetItemCache()
    {
        var value = cc.sys.localStorage.getItem("ItemCacheList");
        if(value == "")
        {
            return null;
        }
        var itemCachList = JSON.parse(value);
        return itemCachList;
        
    },

    GetPlayInfo()
    {
        var value = cc.sys.localStorage.getItem("PlayInfo");
        if(value == "")
        {
            return null;
        }
        var playerInfo = JSON.parse(value);
        return playerInfo;
    },

    
    setPopsCache()
    {
        var popslist =  this.GameInitCom.PopsList;

        var _list = {};

        _list.Diamond =  popslist.Diamond;
        _list.Hammer = popslist.Hammer;
        _list.Change  = popslist.Change;
        _list.Reset = popslist.Reset;
        
        var value = JSON.stringify(_list);
           
        cc.sys.localStorage.setItem("PopsCacheList",value);
    },
    
    getPopsCache()
    {
        //cc.sys.localStorage.removeItem("PopsCacheList");
        var value = cc.sys.localStorage.getItem("PopsCacheList");
        if(value == "")
        {
            return null;
        }
        else
        {
            var popsList = JSON.parse(value);
            return popsList;
        }
       
    },

    //是否过了一天
    IsPassDay()
    {
        var ItemDay = cc.sys.localStorage.getItem("Day");
        var ItemMonth = cc.sys.localStorage.getItem("Month");
        var data = new Date();
        var day = data.getUTCDate();
        var month = data.getUTCMonth();
        if(ItemDay === ""||ItemDay === null)
        {
            this.ReSetCount();
            cc.sys.localStorage.setItem("Day",day);
            cc.sys.localStorage.setItem("Month",month);
            return false ;//不需要重置道具
        }
        else
        {
         
            if(month-ItemMonth>0)
            {
                this.ReSetCount();
                cc.sys.localStorage.setItem("Day",day);
                cc.sys.localStorage.setItem("Month",month);
                return true ;//重置道具
            }
            else
            {
                if(day - ItemDay>0)
                {
                    this.ReSetCount();
                    cc.sys.localStorage.setItem("Day",day);
                    cc.sys.localStorage.setItem("Month",month);
                    return true; 
                }
                else
                {
                    return false;
                }
            }
        }
    },

//更新每天的次数
    ReSetCount()
    {
        cc.sys.localStorage.setItem("DimondCount",5);
        cc.sys.localStorage.setItem("VideoCount",7);
    },


//限制看得砖石的次数
    GetDimondVideoCount()
    {
        var ItemDimondCount = cc.sys.localStorage.getItem("DimondCount");
        if(ItemDimondCount === ""||ItemDimondCount === null)
        {
            cc.sys.localStorage.setItem("DimondCount",5);
            ItemDimondCount = 5;
            return ItemDimondCount;
        }
        else
        {
            if(ItemDimondCount <= 0)
            {
                return -1;
            }
            else
            {
                return ItemDimondCount;
            }
        }
    },
//限制今天看视频的次数
    GetAllVideoCount()
    {
        var Vcount = 7;
        var ItemVideoCount = cc.sys.localStorage.getItem("VideoCount");
        if(ItemVideoCount === ""|| ItemVideoCount === null)
        {
            cc.sys.localStorage.setItem("VideoCount",Vcount);
            return Vcount;
        }
        else
        {
            if(ItemVideoCount <= 0)
            {
                return -1;
            }
            else
            {
                return ItemVideoCount;
            }
        }
    }

/*
    getDiamonCount()
    {
        var value = cc.sys.localStorage.getItem("DiamonCount");
        if(value == "")
        {
            cc.sys.localStorage.setItem("DiamonCount",5);
            return 5;
        }
        else
        {
            return value;
        }
    }
    */
});
