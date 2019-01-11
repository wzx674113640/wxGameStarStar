var FactoryItem = require("FactoryItem");
var FileServe = require("FileServe");
var ShareAndVideo =require("ShareAndVideo");
var UIManage = require("UIManage");
var FlyUI = require("FlyUI");

cc.Class({
    extends: cc.Component,

    properties: {
        BtnResurtDiamon:cc.Node,
        BtnResurt:cc.Node,
        LableTime:cc.Label,
        _timeOne:1,
        _timeSecond:9,
    },

    start () {
         this.GameInitCom = cc.find("Canvas").getComponent("GameInit");
         this.isPause = false;
    },

    Show()
    {
        this._timeSecond = 9;
        this.LableTime.string = this._timeSecond;
        this.node.active = true;
        this.ShowReurtDiamon();
        
        if(FactoryItem.Instance.UIMianCom._PlayInfo._IsResurtTimes<3)
        {
            this.ShowReurt();
        }
        else
        {
            this.ShowReurtDiamon();
        }
        
    },

    ShowReurt()
    {
        this.BtnResurtDiamon.active = false;
        this.BtnResurt.active = true;
    },
    
    ShowReurtDiamon()
    {
        this.BtnResurt.active = false;
        this.BtnResurtDiamon.active = true;
    },

    BtnVideoReurt()
    {
        this.isPause = true;
        ShareAndVideo.Instance.SeeVedioClick(()=>
        {
            this.Resurt();
            this.isPause = false;
        },null,()=>
        {
            this.isPause = false;
        });
    },

    BtnResurtDiamonClick()
    {
        if(this.GameInitCom.PopsList.Diamond>=10)
        {
            FactoryItem.Instance.UIMianCom.UserDiamond(-10);
            this.Resurt();
        }
        else
        {
            this.isPause = true;
            UIManage.Instance.ShowUIDiamon(()=>
            {
                this.isPause = false;
            });
        }
    },

    BtnResurtClick()
    {
        if(FactoryItem.Instance.UIMianCom._PlayInfo._IsResurtTimes>0)
        {
            ShareAndVideo.Instance.AddShareEvent(()=>
            {
                FactoryItem.Instance.UIMianCom._PlayInfo._IsResurtTimes--;
                FactoryItem.Instance.Cache();
                this.Resurt();
            });
        }
    },

    CloseClick()
    {
        FactoryItem.Instance.UIMianCom.CloseUI();
        FactoryItem.Instance.RemoveCache();
        this.node.active = false;
    },

    BtnDontResurt()
    {
        this.node.active = false;
        UIManage.Instance.ShowGameoverUI();
        FactoryItem.Instance.RemoveCache();
    },

    Resurt()
    {
        var cache = FileServe.Instance.GetPlayInfo();
        if(cache!=null)
        {
            cache.IsGameStart = false;
        }
        this.GameInitCom.Init();
        FactoryItem.Instance.UIMianCom.ResurtAndInit();
        cc.sys.localStorage.setItem("ItemCacheList",false);
        
        var index = Math.floor(Math.random()*3);
        index ++;
        FlyUI.Instance.PropsUIFly(index);
        this.node.active = false;
    },
    

   update(dt)
   {
        if(this.isPause)
            return;
        this._timeOne -=dt
        if(this._timeOne<=0)
        {   
            this._timeSecond--;
            this.LableTime.string = this._timeSecond;
            this._timeOne = 1;
            if(this._timeSecond<=0)
            {
                this.BtnDontResurt();
            }
        }
   }
    
});
