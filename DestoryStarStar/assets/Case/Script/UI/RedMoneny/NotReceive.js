var ShareAndVideo = require("ShareAndVideo");
var FileServe = require("FileServe");

cc.Class({
    extends: cc.Component,

    properties: {
        BtnVideo:cc.Node,
        BtnShare:cc.Node,
        NotNeedReward:cc.Node,
    },
    onLoad()
    {
        this.childrenRankCom = cc.find("wx").getComponent("ChildrenRank");
        this.RewardPos = this.NotNeedReward.getPosition();
        this.nodepos = this.node.getPosition();
    },

     Show()
     {
        /*
        this.NotNeedReward.setPosition(this.RewardPos);
        this.NotNeedReward.stopAllActions();
        
        
        var targetPos = ShareAndVideo.Instance.GetNotRwardPos();
        
        if(targetPos != cc.v2(0,0))
        {
            var m = cc.moveTo(0.8,cc.v2(targetPos.x,targetPos.y-this.nodepos.y));
            this.NotNeedReward.runAction(m);
        }
        */
      
         if(this.childrenRankCom.playInfo.is_share == 1 || this.childrenRankCom.playInfo.is_share == undefined)
         {
            if(FileServe.Instance.GetAllVideoCount()<=0)
            {
                this.BtnVideo.active = false;
                this.BtnShare.active = true;
            }
            else
            {
                this.BtnShare.active = false;
                this.BtnVideo.active = true;
            }
         }
         else
         {   
            this.BtnShare.active = false;
            this.BtnVideo.active = true;
         }
         
     }
     

});
