cc.Class({
    extends: cc.Component,
    name: "RankItem",
    properties: {
        rankLabel: cc.Label,
        avatarImgSprite: cc.Sprite,
        nickLabel: cc.Label,
        topScoreLabel: cc.Label,
        MySprite:cc.Node,
        ImgRank:cc.Sprite,
        itemID:0
    },
    start() {

    },

    init: function (rank, data) {
        this.itemID = rank;
        let avatarUrl = data.avatarUrl;
        let nick = data.nickname.length <= 4 ? data.nickname : data.nickname.substr(0, 4) + "...";
        //let nick = data.nickname;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;

        var txtRanking = rank+1;
        
        if(txtRanking>3)
        {
            this.rankLabel.node.active = true;
            this.ImgRank.node.active = false;
            this.rankLabel.string = txtRanking;
        }
        else
        {
            this.rankLabel.node.active = false;
            this.ImgRank.node.active = true;
            this.createImage("src/Rank"+txtRanking+".png",this.ImgRank);
        }
        
        this.createImage(avatarUrl,this.avatarImgSprite);
        this.createImage("src/bg.png",this.MySprite.getComponent(cc.Sprite));
        //this.loadImg(this.avatarImgSprite,avatarUrl);
        this.nickLabel.string = nick;
        this.topScoreLabel.string = grade.toString();
    },

    clear()
    {
        this.rankLabel.string = "";
        this.avatarImgSprite.node.active = false;
        this.nickLabel.string = "";
        this.topScoreLabel.string = "";
        this.MySprite.active = false;
    },


    createImage(avatarUrl,avatarImgSprite) {
        let image = window.wx.createImage();
        var self = this;
        image.onload = function(){
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
            if(avatarImgSprite == self.avatarImgSprite)
                avatarImgSprite.node.active = true;
        };
        image.src = avatarUrl;
    } 
});
