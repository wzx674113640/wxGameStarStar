var UIManage = require("UIManage");
var SoundManage  = require("SoundManage");
var ShareAndVideo = require("ShareAndVideo");
var FileServe = require("FileServe");
cc.Class({
    extends: cc.Component,

    properties: {
       LabelDiamond:cc.Label,
       LabelScore:cc.Label,
       SoundPlay:cc.Node,
       SoundImgList:[cc.SpriteFrame],
       _C2GAction:null,
       childNode:cc.Node,

        AppNodeList:cc.Node,
        Spri:cc.Node,
        
        ScrollView:cc.ScrollView,
        
        Bg:cc.Node,
        DiamonNode:cc.Node,
        PromptNode:cc.Node,
        HasTimeGift:cc.Node,
        NoTimeGift:cc.Node,
        GiftNode:cc.Animation,
        moveSpeed:10,
        RankBtn:cc.Node,
        BtnShareGift:cc.Node

    },

    onDisable()
    {
        this.childrenRankCom.IsShowButton(false);
    },

    onEnable()
    {
        this.spacing = 60;
        this.moveSpeed = 50;
        this.SetDiamond();
        this.childrenRankCom.IsShowButton(true);
        if(this._C2GAction != null)
        {
            this._C2GAction();//新手礼包后返回首页授权
            this._C2GAction = null;
        }
        if(this.isEnbela == undefined)
        {
            this.isEnbela = true;
        }
        else if(this.isEnbela == true)
        {
            if(CC_WECHATGAME)
            {
                this.ShowSeverInfo();
            }
            
        }
        this.TimeLabel = this.NoTimeGift.getComponent(cc.Label);
        this.IsHasTimeGift();
    },

    //判断每日礼包
    IsHasTimeGift()
    {
        //cc.sys.localStorage.setItem("TimeGift","1");
        var IsHasGift = cc.sys.localStorage.getItem("TimeGift");
        
        if(IsHasGift===""||IsHasGift === null)
        {
            this.HasTimeGift.active = true;
            this.NoTimeGift.active = false;
            cc.sys.localStorage.setItem("TimeGift","1");
            this.GiftNode.play();
        }
        else
        {
            if(IsHasGift == "0") //已领取
            {
                if(FileServe.Instance.IsPassDay()) //过了一天重置
                {
                    this.HasTimeGift.active = true;
                    this.NoTimeGift.active = false;
                    cc.sys.localStorage.setItem("TimeGift","1");
                    this.GiftNode.play();
                }
                else //还未重置
                {
                    this.TimeLoad();
                }
            }
            else
            {
                this.HasTimeGift.active = true;
                this.NoTimeGift.active = false;
                cc.sys.localStorage.setItem("TimeGift","1");
                this.GiftNode.play();
            }
            
        }
    },

    TimeLoad()
    {
        this.GiftNode.stop();
        this.GiftNode.node.setRotation(0);
        this.SetDiamond();
        this.HasTimeGift.active = false;
        this.NoTimeGift.active = true;
        this.SetNoHasTimeLabel();
    },

    GetDayTime()
    {
        var endYear=new Date().getFullYear();
        var endMonth=new Date().getMonth();
        var endDay=new Date().getDate()+1;
        this.endTime = new Date(endYear,endMonth,endDay);
    },

    leftDiv(){
        var leftTime=  this.endTime-(new Date().getTime());
        var leftHours = this.addNumber(Math.floor(leftTime/1000/60/60%24));
        var leftMinutes = this.addNumber(Math.floor(leftTime/1000/60%60));
        var leftSeconds = this.addNumber(Math.floor(leftTime/1000%60));
        this.TimeLabel.string = leftHours+":"+leftMinutes+":"+leftSeconds;
        if(leftTime>0){ 
            var self = this;
            setTimeout(function(){
                self.leftDiv();
            },1000);
        }
        else
        {
            this.HasTimeGift.active = true;
            this.NoTimeGift.active = false;
            cc.sys.localStorage.setItem("TimeGift","1");
        }
    },

    addNumber(num){
        var num=(num>9)?num:('0'+num);
        return num;
    },

    SetNoHasTimeLabel()
    {   
        this.GetDayTime();
        this.leftDiv();
    },

    SartAdpativeUI(height)
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
                var mpos = this.DiamonNode.getPosition();
                var ppos = this.PromptNode.getPosition();
                var pos = cc.v2(mpos.x,mpos.y + (height-667-50));
                var pos1 = cc.v2(ppos.x,ppos.y + (height-667-50));
                //需要适配
                this.DiamonNode.setPosition(pos);
                this.PromptNode.setPosition(pos1);
            }
            this.IsAdpative = true;
        }
        
    },

    SetDiamond()
    {
        this.LabelDiamond.string = this.GameInitCom.PopsList.Diamond;
    },
    
    onLoad()
    {
        var ww = this.Spri.getComponent(cc.Widget)
        ww.target = this.node.parent.parent;
        ww.bottom = 0;
        this.childrenRankCom = cc.find("wx").getComponent("ChildrenRank");
        this.GameInitCom = cc.find("Canvas").getComponent("GameInit");
        this.GameInitCom.getPopsInfo();
        this.isSet = false;
        this.isOpen = false;

        let sysInfo = cc.view.getVisibleSize();
        let width = sysInfo.width
        let height = sysInfo.height
        var value = width/height;
        this.Bg.width = width + (80*value);
        this.Bg.height = height + 80;
        this.SartAdpativeUI(height);

        this.moveSate = "left";
        
    },
    
  
    ShowSeverInfo()
    {
        this.childNode.active = true;
        this.SetScore();
        //设置底部
        if(this.childrenRankCom.playInfo._is_status == 1 || this.childrenRankCom.playInfo._is_status == undefined)
        {
            //this.SetAppItem();
            var AppIDInfoList = this.childrenRankCom.SetAppItem();
            var Applength = AppIDInfoList.length;
            UIManage.Instance.ShowAppBtn(AppIDInfoList,Applength)
            var wid = (Applength + 1) * (this.AppNodeList.children[0].width + this.spacing);
            this.AppNodeList.width = wid;
            var AppNodeLength = this.AppNodeList.children.length;
            for(var i = 0;i <= Applength;i++)
            {
                if(Applength == i)
                {
                    if(AppNodeLength > i)
                    {
                        var lastItem = this.AppNodeList.children[i];
                    }
                    else
                    {
                        var lastItem = cc.instantiate(this.AppNodeList.children[0]);
                        lastItem.parent = this.AppNodeList;
                    }
                    lastItem.active = true;
                    lastItem.getComponent("AppItem").set222Touch();
                    break;
                }
                if(AppNodeLength>i)
                {
                    this.AppNodeList.children[i].active = true;
                    this.AppNodeList.children[i].getComponent("AppItem").setItem(AppIDInfoList[i]);
                }
                else
                {
                    var newitem = cc.instantiate(this.AppNodeList.children[0]);
                    newitem.parent = this.AppNodeList;
                    newitem.active = true;
                    newitem.getComponent("AppItem").setItem(AppIDInfoList[i]);
                }
            }
            this.maxX = -375;
            this.minX = -(wid-375); 
            this.BtnShareGift.active = true;
        }
        else
        {
            this.Spri.active = false;
            this.BtnShareGift.active = false;
        }
        
    },

    randomsort(a, b) {
        return Math.random()>.5 ? -1 : 1;
        //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
    },

    SetAppItem()
    {
        var AppIDInfoList = this.childrenRankCom._AppIDInfoList;
        
        AppIDInfoList.sort(this.randomsort);
    },

    SetScore()
    {
        var value = this.childrenRankCom.playInfo; 
        if(value!=undefined&&value!=null)
        {
            if(value.score!=null)
            {
                if(value.score == 0)
                {
                    this.LabelScore.string = "";
                }
                else
                {
                    this.LabelScore.string = "最高分数：" + value.score;
                    this.LabelScore.node.active = true;
                }
               
            }
        }
        else
        {
            this.LabelScore.string = "";
        }
    },

  

    PlaySound()
    {
        if(SoundManage.Instance.IsPlay == false)
        {
            cc.audioEngine.resumeMusic();
            SoundManage.Instance.IsPlay = true;
            this.SoundPlay.getComponent(cc.Sprite).spriteFrame = this.SoundImgList[0]
        }
        else 
        {
            SoundManage.Instance.IsPlay = false;
            cc.audioEngine.pauseMusic();
            this.SoundPlay.getComponent(cc.Sprite).spriteFrame = this.SoundImgList[1]
        }
      
    },

  
    BtnShare()
    {
        ShareAndVideo.Instance.AddShareEvent(()=>
        {
            
        });
    },

    BtnShareFriend()
    {
        UIManage.Instance.ShowUIShareFriend();
    },

    BtnGameStart()
    {
        this.GameInitCom.realGamestart();
        this.childrenRankCom.C2G_GameStart();
    },

    ShowDiamond()
    {
        UIManage.Instance.ShowUIDiamon();
    },
  
    BtnRanking()
    {
        UIManage.Instance.ShowUIRanking();
    },
    
    BtnUICache()
    {
        UIManage.Instance.ShowUICache();
    },

    OtherGameClick(AppID)
    {
        this.childrenRankCom.associatedProgram(AppID);
    },

    BtnShowTimeGift()
    {
        var isHasGift =  cc.sys.localStorage.getItem("TimeGift");
        if(isHasGift == "0") //不能领取
        {
            if(CC_WECHATGAME)
            {
                wx.showToast({
                    title: "明日再来",
                    icon: 'success',
                    duration: 800
                })
            }
        }
        else
        {
            UIManage.Instance.ShowUITimeGift();
        }
       
    },
   
    update(dt)
    {
        if(this.AppNodeList.x >= this.maxX)
        {
            this.moveSate = "left";//-
        } 
        else if(this.AppNodeList.x <= this.minX)
        {
            this.moveSate = "right";//+
        }
        if(this.moveSate == "left")
        {
           this.AppNodeList.x -= dt*this.moveSpeed;
        }
        else if( this.moveSate == "right")
        {
            this.AppNodeList.x += dt*this.moveSpeed;
        }
        /*
        if(this.AppNodeList.x<=-2375)
        {
            this.AppNodeList.x = this.AppNodeList1.x + 2043;
        }
        else
        {
            this.AppNodeList.x -= dt * this.moveSpeed;
        }

        if(this.AppNodeList1.x <= -2375)
        {
            this.AppNodeList1.x = this.AppNodeList.x + 2043;;
        }
        else
        {
            this.AppNodeList1.x -= dt * this.moveSpeed;
        }
        */
    }
});
