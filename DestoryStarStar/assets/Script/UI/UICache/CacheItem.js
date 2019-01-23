var ShareAndVideo = require("ShareAndVideo");
var FileServe = require("FileServe");
var UIManage = require("UIManage");
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    
    onLoad() {
        this.LabelLevel = this.node.getChildByName("LabelLevel").getComponent(cc.Label);
        this.LabelScore = this.node.getChildByName("LabelScore").getComponent(cc.Label);
        this.BtnAagin = this.node.getChildByName("BtnAagin");
        this.BtnReurt = this.node.getChildByName("BtnReurt");
        this.RankUI = this.node.getChildByName("RankUI");
        this.ID = -1;
        this.UIParent = this.node.parent;
        this.GameInitCom = cc.find("Canvas").getComponent("GameInit");
    },

    SetItem(level,score,IsNeedResurt,id)
    {
        this.RankUI.active = true;
        this.ID = id;
        this.LabelLevel.string = "关卡："+level;
        this.LabelScore.string = "分数："+ score;
        if(IsNeedResurt)
        {
            this.BtnReurt.active = true;
            this.BtnAagin.active = false;
        }
        else
        {
            this.BtnAagin.active = true;
            this.BtnReurt.active = false;
        }
    },
    
    Clear()
    {
        this.RankUI.active =false;
        this.BtnAagin.active =false;
        this.BtnReurt.active = false;
        this.LabelLevel.string ="";
        this.LabelScore.string ="";
    },
    
    BtnAaginClick()
    {
        if(FileServe.Instance.GetAllVideoCount()==-1)
        {
            ShareAndVideo.Instance.AddShareEvent(()=>
            {
                FileServe.Instance.ReadCache(this.ID);
                //UIManage.Instance.ShowGameing();
                this.GameInitCom.GameStart(true);
                this.UIParent.active = false;
            });
        }
        else
        {
            ShareAndVideo.Instance.SeeVedioClick(()=>
            {
                FileServe.Instance.ReadCache(this.ID);
                //UIManage.Instance.ShowGameing();
                this.GameInitCom.GameStart(true);
                this.UIParent.active = false;
            });
        }
        
    },

    BtnReurtClick()
    {
        if(this.GameInitCom.PopsList.Diamond >= 30)
        {
            FileServe.Instance.ReadCache(this.ID);
            //UIManage.Instance.ShowGameing();
            this.GameInitCom.GameStart(true);
            this.UIParent.active = false;

            if(UIManage.Instance.SceneState == "Gaming")
            {
                var FactoryItem = require("FactoryItem");
                FactoryItem.Instance.UIMianCom.UserDiamond(-30); 
            }
            else if(UIManage.Instance.SceneState =="Start")
            {
                this.GameInitCom.PopsList.Diamond-=30;
                
                UIManage.Instance.UIList[UIManage.Instance.Starting.name].getComponent("UIStart").SetDiamond();
            }
        }
        else
        {
            UIManage.Instance.ShowUIDiamon();
        }
        
    }
    

});
