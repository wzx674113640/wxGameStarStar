var UIManage = require("UIManage");
var SoundManage  = require("SoundManage");
var ShareAndVideo = require("ShareAndVideo");
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

      
    },

    onEnable()
    {
        this.SetDiamond();
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
    },

    SetDiamond()
    {
        this.LabelDiamond.string = this.GameInitCom.PopsList.Diamond;
    },
    
    onLoad()
    {
        this.childrenRankCom = cc.find("wx").getComponent("ChildrenRank");
        this.GameInitCom = cc.find("Canvas").getComponent("GameInit");
        this.GameInitCom.getPopsInfo();
        this.isSet = false;
        this.isOpen = false;
    },
    
    start()
    {
        //this.SetScore();
    },

    ShowSeverInfo()
    {
      
        this.childNode.active = true;
        this.SetScore();
        //设置底部
        if(this.childrenRankCom.playInfo._is_status == 1)
        {
            var UIAppBtn =  UIManage.Instance.ShowAppBtn();
            this.SetAppItem();
            var AppIDInfoList = this.childrenRankCom._AppIDInfoList;
            var Applength = AppIDInfoList.length;
            UIAppBtn.getComponent("UIBtnApp").ShowItem(AppIDInfoList,Applength);
            for(var i = 0;i < this.AppNodeList.children.length;i++)
            {
                if(Applength > i)
                {
                    this.AppNodeList.children[i].getComponent("AppItem").setItem(AppIDInfoList[i]);
                }
                else
                {
                    this.AppNodeList.children[i].active = false;
                }
            }
            
        }
        else
        {
            this.AppNodeList.active = false;
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
                this.LabelScore.string = "历史最高分：" + value.score;
            }
        }
        else
        {
            this.LabelScore.string = "";
        }
    },

    update()
    {
       
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

});
