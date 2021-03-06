var FactoryItem = require("FactoryItem");
var PlayInfo = require("PlayInfo");

var FileServe = require("FileServe");
var UIManage = require("UIManage");
var FlyUI = require("FlyUI");

var ShareAndVideo = require("ShareAndVideo");

cc.Class({
    extends: cc.Component,

    properties: {
        LableScoreUI:cc.Label,
        //Mask: cc.Node,
        //NextBtn: cc.Node,
        //RsetBtn: cc.Node,
        //UIProte: cc.Node,
        //LabelProte : cc.Label,
        LableNeedScoreUI :cc.Label,
        LevelLabel: cc.Label,
        ScoreUIPos:cc.Node,
        BarScore:cc.ProgressBar, //进度条

        
        RemainUI:cc.Node,
        AwardScoreLabel: cc.Label,
        remianCountLabel:cc.Label,

        
        PropsHammer:cc.Node,
        PropsChange:cc.Node,
        PropsRest:cc.Node,
        PropsDes:cc.Node,

        DiamondCountLabel:cc.Label,

        UIProposChangePanel:cc.Node,

        PropsAniPanel:cc.Node,

        AniLabelTargetScore:cc.Node,
        AniLabellevel:cc.Node,

        UIPromptStar:cc.Node,

        GetScoreUI:cc.Label,

        _PlayInfo:null,
        
        ChangeAniNode:cc.Node,

        HammerAniNode:cc.Node,

        MoneyLabel:cc.Label,
        //_TouchState: "", //道具状态 ""：正常 "1"：锤子 "2":...
        Adver:cc.Node,

        BtnPauseNode:cc.Node
    },

    onLoad()
    {
        this.GameInitCom = cc.find("Canvas").getComponent("GameInit");
        this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
        this.UpLayout = this.node.getChildByName("UpLayout");
        this.AdpativeUI();
        this._PlayInfo = new PlayInfo();

        this.isCoolReset = true;
    },
    
    setMoneyLabel()
    {
        if(!CC_WECHATGAME)
            return;
        if(this.ChildrenRankCom.playInfo.isRecive)
        {
            this.MoneyLabel.string = this.ChildrenRankCom.playInfo.money + "福券";
        }
        else
        {
            this.MoneyLabel.string = "待领取";
        }
    },

    AdpativeUI()
    {
        if(!CC_WECHATGAME)
            return;
        if(this.IsAdpative==undefined)
        {
            let sysInfo = window.wx.getSystemInfoSync();
            let width = sysInfo.screenWidth;
            let height = sysInfo.screenHeight;
            if(height/width>2)
            {
                var mpos =  this.UpLayout.getPosition();
                var pos = cc.v2(mpos.x,mpos.y + 80);
                //需要适配
                this.UpLayout.setPosition(pos);

                var small = this.ChildrenRankCom.SmallChilrenView.node;
                var cPos = small.getPosition();
                var posc = cc.v2(cPos.x,cPos.y + 80);
                small.setPosition(posc);
            }
            this.IsAdpative = true;
        }
        
    },
  
    BtnOpenMoney()
    {
        UIManage.Instance.ShowOpenMoney();
    },

    StartAnimation(action)
    {
        var posLevel = this.AniLabellevel.getPosition();
        var posScore = this.AniLabelTargetScore.getPosition();

        var startPosLevel = cc.v2(500,posLevel.y);
        var startPosScore = cc.v2(500,posScore.y);

        var anitime = 0.2;

        this.AniLabellevel.active = true;
        this.AniLabelTargetScore.active = true;

       
        this.AniLabellevel.setPosition(startPosLevel);
        this.AniLabelTargetScore.setPosition(startPosScore);

        this.AniLabellevel.getComponent(cc.Label).string = "第"+this._PlayInfo._Level+"关";
        this.AniLabelTargetScore.getComponent(cc.Label).string = "目标："+this._PlayInfo._NeedScore;

       var levelUI = cc.moveBy(anitime,cc.v2(-500,0));
       var c0 = cc.callFunc(function()
       {
            var scoreUI = cc.moveBy(anitime,cc.v2(-500,0));
            var c1 = cc.callFunc(function()
            {
                var b = cc.blink(0.8, 2);
                var c2 = cc.callFunc(function()
                {
                    var left1 = cc.moveBy(anitime,cc.v2(-500,0));
                   
                    var left2 = cc.moveBy(anitime,cc.v2(-500,0));
                    this.AniLabelTargetScore.runAction(left1);
                   
                    this.AniLabellevel.runAction(left2);
                    this.scheduleOnce(()=>
                    {   
                        action();
                    },anitime);
                }.bind(this));
                this.LableNeedScoreUI.node.runAction(cc.sequence(b,c2));
            }.bind(this));
            this.AniLabelTargetScore.runAction(cc.sequence(scoreUI,c1));
       }.bind(this));
       this.AniLabellevel.runAction(cc.sequence(levelUI,c0))
       
    },

    BtncloseGaming()
    {
        if(FactoryItem.Instance.IsGameStart&&FactoryItem.Instance._IsTouch)
        {
            this.cache();
            FactoryItem.Instance.Clear();
            //this.UIPromptStar.getComponent("UIPromptStar").Close();
            UIManage.Instance.ShowGameStart();
            this.UIProposChangePanel.active = false;
            this.PropsAniPanel.active = false;
            this.BtnPauseNode.active = false;
        }
    },

    BtnPauseClick()
    {
        this.BtnPauseNode.active = true;
    },

    BtnAgianGClick()
    {
        this.BtnPauseNode.active = false;
    },

    BtnResurtClick()
    {
        this.GameInitCom.Init();
        this._PlayInfo._Score = this._PlayInfo._LastScore;
        this.BtnPauseNode.active = false;
        this.LableScoreUI.string = this._PlayInfo._Score;
        FactoryItem.Instance.StopPromptAnimation();
    },

    cache()
    {   
        FileServe.Instance.SetPlayInfoCache();

        if(FactoryItem.Instance.isReset)
        {
            FileServe.Instance.SetPlayInfoCache();
            return;
        }
        if(FactoryItem.Instance.IsGameStart&&FactoryItem.Instance._IsTouch)
        {
            FileServe.Instance.StartItemCache();//储存关卡数和Item的位置
        }
        else
        {
            FileServe.Instance.SetPlayInfoCache();//只存关卡数
        }
        
    },  

    onEnable()
    {
        this.ResurtAndInit();
        this.InitUI();
        ShareAndVideo.Instance.ShowOrHideAdervert(true);
        if(!CC_WECHATGAME)
        {
            return;
        }
        if(this.ChildrenRankCom.playInfo._is_status == 1 || this.ChildrenRankCom.playInfo._is_status == undefined)
        {
            //this.PropsDes.active = true;
            var value = this.ChildrenRankCom._AppIDInfoList.length;
            if(value > 0)
            {
               this.ShowUpAppItem();
            }
            else
            {
                this.Adver.active = false;
            }
        }
        else
        {
            //this.PropsDes.active = false;
            this.Adver.active = false;
        }
    },

    ShowUpAppItem()
    {
        var cList = this.ChildrenRankCom._AppIDInfoList;
        var value = Math.floor(Math.random()*cList.length);
        this.Adver.getComponent("AppItem").setItem(cList[value],()=>
        {
            this.ShowUpAppItem();
        });
    },

    onDisable()
    {
        ShareAndVideo.Instance.ShowOrHideAdervert(false);
    },
    
    ResurtAndInit()
    {
        var cache = FileServe.Instance.GetPlayInfo();
        
        if(cache != null)
        {
            this._PlayInfo._LastNeedScore = cache._LastNeedScore;
            
            if(cache.IsGameStart == false)
            {
                this._PlayInfo._Score = cache._LastScore;
            }
            else
            {
                var cache1 = cc.sys.localStorage.getItem("VesionScore");
                if(cache1 == null || cache1 == "")
                {
                    this._PlayInfo._Score = cache._LastScore;
                    cc.sys.localStorage.setItem("VesionScore",this.ChildrenRankCom._version);
                }
                else
                {
                    if(Number(cache1) == this.ChildrenRankCom._version)
                    {
                        this._PlayInfo._Score = cache._Score;
                    }
                    else
                    {
                        this._PlayInfo._Score = cache._LastScore;
                        cc.sys.localStorage.setItem("VesionScore",this.ChildrenRankCom._version);
                    }
                }
            }
            this._PlayInfo._LastScore = cache._LastScore;
            this._PlayInfo._Level = cache._Level;
            this._PlayInfo._NeedScore = cache._NeedScore; 
            this._PlayInfo._ID = cache._ID;
            
            this._PlayInfo._IsShowPass = cache._IsShowPass;
            this._PlayInfo._IsResurtTimes = cache._IsResurtTimes;
            this._PlayInfo._IsShowSkill = cache._IsShowSkill;

            this.LableScoreUI.string = this._PlayInfo._Score;
            this.LableNeedScoreUI.string =  this._PlayInfo._NeedScore;
            this.LevelLabel.string = this._PlayInfo._Level;
            
            this.setLableUI(0);
        }
        else
        {
            this._PlayInfo = new PlayInfo ();
            this.LableScoreUI.string = this._PlayInfo._Score;
            this.LableNeedScoreUI.string = this._PlayInfo._NeedScore;
            this.LevelLabel.string = this._PlayInfo._Level;
        }
        
        this.UpdateFreindRank();
    },

    UpdateFreindRank()
    {
        return;
        this.ChildrenRankCom.ShowChildrenGameOver(this._PlayInfo._Score);
        this.ChildrenRankCom.ShowOne();
    },

    //返回首页
    CloseUI()
    {
        FactoryItem.Instance.Clear();
        UIManage.Instance.ShowGameStart();
    },

    InitUI()
    {
        //红包金额
        this.setMoneyLabel();

        this.DiamondCountLabel.string = this.GameInitCom.PopsList.Diamond;
        var Hammer = this.GameInitCom.PopsList.Hammer;
        var hammerCom = this.PropsHammer.getComponent("PopsUIBtn");
        if(Hammer>0)
        {
            hammerCom.Has(Hammer);
        }
        else
        {
            hammerCom.NoHas();
        }
        var Reset = this.GameInitCom.PopsList.Reset;
        var resetCom = this.PropsRest.getComponent("PopsUIBtn");
        if(Reset>0)
        {
            resetCom.Has(Reset);
        }
        else
        {
            resetCom.NoHas();
        }
        var Change = this.GameInitCom.PopsList.Change;
        var changeCom = this.PropsChange.getComponent("PopsUIBtn");
        if(Change>0)
        {   
            changeCom.Has(Change);
        }
        else
        {
            changeCom.NoHas();
        }
    },

    ShowHammerAni()
    {
        this.HammerAniNode.active = true;
        this.ChangeAniNode.active = false;
        this.HammerAniNode.getComponent(cc.Animation).play("Hammer");
    },
    ShowChangeAni()
    {
        this.HammerAniNode.active = false;
        this.ChangeAniNode.active = true;
        this.ChangeAniNode.getComponent(cc.Animation).play("ChangeAni");
    },

    //注册道具事件
    OnPropsEvent()
    {  
        var self = this;
        this.PropsHammer.on(cc.Node.EventType.TOUCH_START, function(event)
        {
            if(FactoryItem.Instance._TouchState !="")
            {
                self.CancelProps();
                return;
            }
            var value = self.GameInitCom.PopsList.Hammer;
            if(value>0)
            {   
                if(FactoryItem.Instance._TouchState == ""&&FactoryItem.Instance._IsTouch&&FactoryItem.Instance.IsGameStart)
                {
                    ShareAndVideo.Instance.AdervertActive(false);
                    FactoryItem.Instance._TouchState = "1"; //锤子
                    self.PropsAniPanel.active = true;
                    self.ShowHammerAni();
                }
            }
            else
            {
                //道具不够 扣除钻石
                if(self.GameInitCom.PopsList.Diamond>=50)
                {
                    ShareAndVideo.Instance.AdervertActive(false);
                    FactoryItem.Instance._TouchState = "1"; //锤子
                    self.PropsAniPanel.active = true;
                    self.ShowHammerAni();
                }
                else
                {
                    //弹框需要充值或看视频得钻石
                    //self.ShowDiamonUI(2);
                    self.OpenPanelDiamon();
                }
            }
        });

        this.PropsChange.on(cc.Node.EventType.TOUCH_START, function(event)
        {
            if(FactoryItem.Instance._TouchState !="")
            {
                self.CancelProps();
                return;
            }
            var value = self.GameInitCom.PopsList.Change;
            if(value>0)
            {   
                if(FactoryItem.Instance._TouchState ==""&&FactoryItem.Instance._IsTouch&&FactoryItem.Instance.IsGameStart)
                {
                    ShareAndVideo.Instance.AdervertActive(false);
                    FactoryItem.Instance._TouchState = "2"; //改变颜色
                    self.PropsAniPanel.active = true;
                    self.ShowChangeAni();
                }
            }
            else
            {
                //道具不够 扣除钻石
                if(self.GameInitCom.PopsList.Diamond>=50)
                {
                    ShareAndVideo.Instance.AdervertActive(false);
                    FactoryItem.Instance._TouchState = "2"; //改变颜色
                    self.PropsAniPanel.active = self;
                    //更新UI
                    self.ShowChangeAni();
                }
                else
                {
                    //弹框需要充值或看视频得钻石
                    
                    //self.ShowDiamonUI(3);
                    self.OpenPanelDiamon();
                }
            }
        });

        this.PropsRest.on(cc.Node.EventType.TOUCH_START, function(event)
        {
            if(FactoryItem.Instance._TouchState !="")
            {
                self.CancelProps();
                return;
            }
            var value = self.GameInitCom.PopsList.Reset;
            if(value>0)
            {  
                if(FactoryItem.Instance._TouchState ==""&&FactoryItem.Instance._IsTouch&&FactoryItem.Instance.IsGameStart&&self.isCoolReset)
                {
                   self.UserResetControl();
                }
            }
            else
            {
                //道具不够 扣除钻石
                if(self.GameInitCom.PopsList.Diamond>=50)
                {
                    self.GameInitCom.PopsList.Diamond -=50;
                    self.DiamondCountLabel.string = self.GameInitCom.PopsList.Diamond;
                    FactoryItem.Instance.PropsRest();
                    //更新UI
                }
                else
                {
                    //弹框需要充值或看视频得钻石
                    
                    //self.ShowDiamonUI(1);
                    self.OpenPanelDiamon();
                }
            }
        });
        /*
        this.PropsDes.on(cc.Node.EventType.TOUCH_START, function(event)
        {
            if(FactoryItem.Instance._TouchState ==""&&FactoryItem.Instance._IsTouch&&FactoryItem.Instance.IsGameStart)
            {
                FactoryItem.Instance.DestorySameColorProps();
                FactoryItem.Instance._IsTouch = false;
            }
        });
        */
    },

    
    UserResetControl()
    {
        var self = this;
        self.isCoolReset = false;
        FactoryItem.Instance.PropsRest();
        self.GameInitCom.PopsList.Reset-=1;
        var PosUIBtnCom = self.PropsRest.getComponent("PopsUIBtn");
        if(self.GameInitCom.PopsList.Reset>0)
        {
            PosUIBtnCom.Has(self.GameInitCom.PopsList.Reset);
        }
        else
        {
            PosUIBtnCom.NoHas();
        }
        self.scheduleOnce(()=>
        {
            self.isCoolReset = true;
        },1);
    },

    ShowDiamonUI(index)
    {
        //UIManage.Instance.ShowUIDiamon();
        ShareAndVideo.Instance.ShareAndVideo(()=>
        {
            FlyUI.Instance.PropsUIFly(index);
        });
    },

    OpenPanelDiamon()
    {
        UIManage.Instance.ShowUIDiamon();
    },

    UserHammerProps(value =-1)
    {
        var self = this;
        self.GameInitCom.PopsList.Hammer+=value;
        var PosUIBtnCom = self.PropsHammer.getComponent("PopsUIBtn");
        if(self.GameInitCom.PopsList.Hammer>0)
        {
            PosUIBtnCom.Has(self.GameInitCom.PopsList.Hammer);
        }
        else
        {
            PosUIBtnCom.NoHas();
        }
    },

    UserDiamond(value = -50)
    {
        var self = this;
        self.GameInitCom.PopsList.Diamond += value;
        self.DiamondCountLabel.string = self.GameInitCom.PopsList.Diamond;
    },

    UserChange(value = -1)
    {
        var self = this;
        self.GameInitCom.PopsList.Change+=value;
        var PosUIBtnCom = self.PropsChange.getComponent("PopsUIBtn");
        if(self.GameInitCom.PopsList.Change>0)
        {
            PosUIBtnCom.Has(self.GameInitCom.PopsList.Change);
        }
        else
        {
            PosUIBtnCom.NoHas();
        }
    },
    
    UserReset(value =-1)
    {
        var self = this;
        self.GameInitCom.PopsList.Reset+=value;
        var PosUIBtnCom = self.PropsRest.getComponent("PopsUIBtn");
        if(self.GameInitCom.PopsList.Reset>0)
        {
            PosUIBtnCom.Has(self.GameInitCom.PopsList.Reset);
        }
        else
        {
            PosUIBtnCom.NoHas();
        }
    },

    CancelProps(IsState = true)
    {   
        ShareAndVideo.Instance.AdervertActive(true);
        
        if(IsState)
        {
            FactoryItem.Instance._TouchState = "";
        }
        if(FactoryItem.Instance.ItemLastCom!=undefined)
        {
            FactoryItem.Instance.ItemLastCom.HideLight();
            FactoryItem.Instance.ItemLastCom = undefined;
        }
        this.PropsAniPanel.active = false;
        this.UIProposChangePanel.active = false;
    },

    start () {
        this.OnPropsEvent();
    },  

    setLableUI(score)
    {
        this._PlayInfo._Score += score;
        this.LableScoreUI.string = this._PlayInfo._Score;
        var value = (this._PlayInfo._Score-this._PlayInfo._LastNeedScore)/(this._PlayInfo._NeedScore-this._PlayInfo._LastNeedScore + 800);
        this.BarScore.progress = value>1?1:value;
    },
    
    ShowFail()
    {
        UIManage.Instance.ShowUIResurt();
        FactoryItem.Instance.isGameOver = true;
         //打开开放域
        //this.ChildrenRankCom.ShowChildrenGameOver(this._PlayInfo._Score);
        //FactoryItem.Instance.RemoveCache();
    },

    ShowSuccess()
    {
        //this.Mask.active = true;
        //this.NextBtn.active = true;
        //this.UIProte.active = true;
        //this.LabelProte.string = "恭喜进入下一关！";
       
        var targetValue = this._PlayInfo._NeedScore+800 ; 
        if(this._PlayInfo._Score>=targetValue)
        {
            UIManage.Instance.ShowNextUIWonderful();
        }
        else
        {
            UIManage.Instance.ShowNextUI();
        }
        
        this._PlayInfo.NextLevel();
        
        FactoryItem.Instance.Cache();
    },

    IsPass()
    {
        if(this._PlayInfo._Score >= this._PlayInfo._NeedScore)
        {
            return  true;
        }
        else
        {
            return false;
        }
    },

    ShowGetScoreUI(count,isSkill)
    {
        this.GetScoreUI.node.opacity = 0;
        this.ShowGetScoreTime = 2;
        var score = 0;
        if(isSkill == false)
        {
            for(var i = 0;i<count;i++)
            {
                score += (5+10*i);
            }
        }
        else
        {
            score = count*10;
        }
        
        this.GetScoreUI.string = count+"连消 "+score+"分"
        var c = cc.fadeIn(0.5);
        this.GetScoreUI.node.runAction(c);
        
    },

    update(dt)
    {
        if(this.ShowGetScoreTime!=undefined&&this.ShowGetScoreTime >= 0)
        {
            this.ShowGetScoreTime-=dt;
            if(this.ShowGetScoreTime<0)
            {
                this.GetScoreUI.node.opacity = 0;
            }
        }
    },

    NextLevel(isMove = true )
    {
        if(this.IsNextEvent())
        {
            this.LableNeedScoreUI.string = this._PlayInfo._NeedScore;
            this.LevelLabel.string = this._PlayInfo._Level;
            if(isMove)
            {
                FactoryItem.Instance.Init();
            }
            
            if(this._PlayInfo._Level % 2 == 0)
            {
                ShareAndVideo.Instance.ShowOrHideAdervert(false);
                ShareAndVideo.Instance.ShowOrHideAdervert(true);
            }

            if(CC_WECHATGAME)
            {
                this.ShowUpAppItem();
            }
        } 
    },

    RestLevel()
    {
        //this.Mask.active = false;
        //this.NextBtn.active = false;
        //this.UIProte.active = false;
        //this.RsetBtn.active = false;

        this._PlayInfo.ResetInfo();
        this.LableScoreUI.string = this._PlayInfo._Score;
        this.LableNeedScoreUI.string = this._PlayInfo._NeedScore;
        this.LevelLabel.string = this._PlayInfo._Level;
        FactoryItem.Instance.Init();
    },

    IsNextEvent()
    {
        this.ChildrenRankCom.SubmitScore(this._PlayInfo._Score,this._PlayInfo._Level);
        
        if(this._PlayInfo._Score>=this._PlayInfo._NeedScore)
        {
            this._PlayInfo.NextLevel();
        
            FactoryItem.Instance.Cache();
            var IsSuccess = true;
        }
        else
        {
            this.ChildrenRankCom.ShowChildrenGameOver(this._PlayInfo._Score);
            this.ShowFail();
            var IsSuccess = false;
        }
        if(CC_WECHATGAME)
        {
            wx.triggerGC();
        }
        return IsSuccess;
    },

    IsSuccess()
    {
        //提交分数
        this.ChildrenRankCom.SubmitScore(this._PlayInfo._Score,this._PlayInfo._Level);
        
        if(this._PlayInfo._Score>=this._PlayInfo._NeedScore)
        {
            this.ShowSuccess();
        }
        else
        {
            this.ChildrenRankCom.ShowChildrenGameOver(this._PlayInfo._Score);
            this.ShowFail();
        }
        if(CC_WECHATGAME)
        {
            wx.triggerGC();
        }
    },

    ShowRemian(awardScore,remianCount)
    {
        this.RemainUI.active = true;
        this.AwardScoreLabel.node.parent.active = true;
        this.AwardScoreLabel.node.parent.setScale(1);
        this.AwardScoreLabel.string = awardScore;
        this.remianCountLabel.string ="剩余：" + remianCount;
    },

    HideRemian()
    {
        this.RemainUI.active = false;
    },

    AddRemianScore(score,action)
    {
        var nodeAni = this.AwardScoreLabel.node.parent;
        var s =  cc.scaleTo(0.2,0.1);
        var call = cc.callFunc(function()
        {
            nodeAni.active = false;
            FlyUI.Instance.RemianFlyUI(nodeAni,this.ScoreUIPos,score,action);
        }.bind(this)); 
        if(score>0)
        {
            nodeAni.runAction(cc.sequence(s,call));
        }
        else
        {
            FlyUI.Instance.RemianFlyUI(nodeAni,this.ScoreUIPos,score,action);
        }
        
    }

});
