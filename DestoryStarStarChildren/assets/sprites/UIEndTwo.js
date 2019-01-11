
cc.Class({
    extends: cc.Component,

    properties: {
       MidRank: cc.Label,
       LeftRank: cc.Label,
       RightRank:cc.Label,

       MidScore: cc.Label,
       LeftScore: cc.Label,
       RightScore:cc.Label,

        MidName:cc.Label,
        LeftName:cc.Label,
        RightName:cc.Label,

        MidRankImg:cc.Sprite,
        LeftRankImg:cc.Sprite,
        RightRankImg:cc.Sprite,

       MidImg: cc.Sprite,
       LeftImg: cc.Sprite,
       RightImg:cc.Sprite,

       MidNode: cc.Node,
       LeftNode:cc.Node,
       RightNode:cc.Node,
    },


    Clear()
    {
        this.MidNode.active = false;
        this.LeftNode.active = false;
        this.RightNode.active = false;
    },

    setSelf(rankNum,data)
    {
        this.MidNode.active = true;
        if(rankNum>3)
        {
            this.MidRank.node.active = true;
            this.MidRankImg.node.active = false;
            this.MidRank.string = rankNum;
        }
        else
        {
            this.MidRank.node.active = false;
            this.MidRankImg.node.active = true;
            this.createImage("src/Rank"+rankNum+".png",this.MidRankImg);
        }
        let score  = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.MidScore.string = score;
        let nick = data.nickname.length <= 4 ? data.nickname : data.nickname.substr(0, 4) + "...";
        this.MidName.string = nick;
        this.createImage(data.avatarUrl,this.MidImg);                      
    },
    
    setLeft(rankNum,data)
    {
        this.LeftNode.active = true;
        if(rankNum>3)
        {
            this.LeftRank.node.active = true;
            this.LeftRankImg.node.active = false;
            this.LeftRank.string = rankNum;
        }
        else
        {
            this.LeftRank.node.active = false;
            this.LeftRankImg.node.active = true;
            this.createImage("src/Rank"+rankNum+".png",this.LeftRankImg);
        }
        let score  = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.LeftScore.string = score;
        let nick = data.nickname.length <= 4 ? data.nickname : data.nickname.substr(0, 4) + "...";
        this.LeftName.string = nick;
        this.createImage(data.avatarUrl,this.LeftImg);                      
    },

    setRight(rankNum,data)
    {
        this.RightNode.active = true;
        if(rankNum>3)
        {
            this.RightRank.node.active = true;
            this.RightRankImg.node.active = false;
            this.RightRank.string = rankNum;
        }
        else
        {
            this.RightRank.node.active = false;
            this.RightRankImg.node.active = true;
            this.createImage("src/Rank"+rankNum+".png",this.RightRankImg);
        }
        let score  = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.RightScore.string = score;
        let nick = data.nickname.length <= 4 ? data.nickname : data.nickname.substr(0, 4) + "...";
        this.RightName.string = nick;
        this.createImage(data.avatarUrl,this.RightImg);                      
    },

    createImage(avatarUrl,ImgHead) {
        let image = window.wx.createImage();
        image.onload = function(){
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            ImgHead.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = avatarUrl;
    } ,

});
