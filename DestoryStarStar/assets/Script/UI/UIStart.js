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

       LeftAppNodeList:cc.Node,

       BtnAppList:cc.Node,

       BtnAppListSprite:{
           type:cc.SpriteFrame,
           default:[]
       }
    },

    onEnable()
    {
        this.SetDiamond();
        if(this._C2GAction != null)
        {
            this._C2GAction();
            this._C2GAction = null;
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
            var AppIDInfoList = this.childrenRankCom._AppIDInfoList;
            var Applength = AppIDInfoList.length;
            for(var i = 0;i < this.AppNodeList.children.length;i++)
            {
                if(Applength > i)
                {
                    this.AppNodeList.children[i].getComponent("AppItem").setItem(AppIDInfoList[i]);
                }
            }
            for(var i = 0;i < this.LeftAppNodeList.children.length;i++)
            {
                if(Applength > i)
                {
                    this.LeftAppNodeList.children[i].getComponent("AppItem").setItem(AppIDInfoList[i]);
                }
            }
        }
        else
        {
            this.AppNodeList.active = false;
            this.BtnAppList.active = false;
        }
        /*
        var AppIDInfoList = this.childrenRankCom._AppIDInfoList[0];
        for(var i = 0;i < this.AppNodeList.children.length;i++)
        {
            this.AppNodeList.children[0].getChildByName("HeadImg").getComponent(cc.Sprite).spriteFrame = AppIDInfoList.img;
        }
        this.AppNodeList[0].on(cc.Node.EventType.TOUCH_START, function(event)
        {
            var appinfo = AppIDInfoList;
            this.childrenRankCom.associatedProgram(appinfo.appid);
        }
        */
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
        //if(this.childrenRankCom.playInfo != undefined&&this.childrenRankCom.playInfo.score != null&&this.isSet==false)
        //{
        //    this.isSet = true;
        //   this.SetScore();
        //}
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

    AppClick()
    {
        if(this.isOpen == false)
        {
            var m = cc.moveBy(0.3,cc.v2(425,0));
            this.BtnAppList.runAction(m);
            this.isOpen = true;
            this.BtnAppList.getComponent(cc.Sprite).spriteFrame = this.BtnAppListSprite[0];
        }
        else
        {
            var m = cc.moveBy(0.3,cc.v2(-425,0));
            this.BtnAppList.runAction(m);
            this.isOpen = false;
            this.BtnAppList.getComponent(cc.Sprite).spriteFrame = this.BtnAppListSprite[1];
        }
    }
});
