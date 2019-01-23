var Helper = require("Helper");
cc.Class({
    extends: cc.Component,

    properties: {
       RankingImgList:[cc.SpriteFrame],
    },

  
    onLoad () {
        this.TxtRank = this.node.getChildByName("TxtRank").getComponent(cc.Label);
        this.ImgRank = this.node.getChildByName("ImgRank").getComponent(cc.Sprite);
        this.ImgHead = this.node.getChildByName("ImgHead").getComponent(cc.Sprite);
        this.TxtName = this.node.getChildByName("TxtName").getComponent(cc.Label);
        this.TxtScore = this.node.getChildByName("TxtScore").getComponent(cc.Label);
    }, 

    SetItem(txtRanking,imgHeadUrl,txtName,txtScore)
    {
        if(txtRanking<4)
        {
            var value = txtRanking-1;
            this.ImgRank.node.active = true;
            this.ImgRank.spriteFrame = this.RankingImgList[value];
        }
        else if(txtRanking>=4)
        {
            this.ImgRank.node.active = false;
            this.TxtRank.node.active = true;
            this.TxtRank.string = txtRanking;
        }
        let nick = txtName.length <= 4 ? txtName : txtName.substr(0, 4) + "...";
        this.TxtName.string = nick;
        this.TxtScore.string = txtScore;
        Helper.Instance.createImage(imgHeadUrl,this.ImgHead);
        this.ImgHead.node.active = true;
    },
    
    Clear()
    {
        this.TxtRank.string = "";
        this.TxtName.string ="";
        this.TxtScore.string = "";
        this.ImgHead.node.active = false;
        this.ImgRank.node.active = false;
    }
});
