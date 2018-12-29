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
    },

    onEnable()
    {
        this.LabelDiamond.string = this.GameInitCom.PopsList.Diamond;
    },

    onLoad()
    {
        this.GameInitCom = cc.find("Canvas").getComponent("GameInit");
        this.GameInitCom.getPopsInfo();
    },
    
    start()
    {
        //this.SetScore();
    },

    SetScore()
    {
        var value = cc.find("wx").getComponent("ChildrenRank").playInfo; 
        if(value!=undefined)
        {
            this.LabelScore.string = value.score;
        }
    },

    PlaySound()
    {
        SoundManage.Instance.IsPlay = !SoundManage.Instance.IsPlay;
        if(SoundManage.Instance.IsPlay)
        {
            this.SoundPlay.getComponent(cc.Sprite).spriteFrame = this.SoundImgList[0]
        }
        else
        {
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
    }
});
