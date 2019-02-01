// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("RankItem"),

    properties: {
      
    },

    onLoad () {
        this.TxtRank = this.node.getChildByName("TxtRank").getComponent(cc.Label);
        
        this.TxtScore = this.node.getChildByName("TxtScore").getComponent(cc.Label);

        //this.TxtLevel = this.node.getChildByName("TxtLevel").getComponent(cc.Label); 
    }, 

    SetItem(txtRanking,imgHeadUrl,txtName,txtScore)
    {
        this.TxtRank.string = txtRanking;
        this.TxtScore.string = txtScore;
    },
    
    Clear()
    {
        this.TxtRank.string = "";
       
        this.TxtScore.string = "";
    }

});
