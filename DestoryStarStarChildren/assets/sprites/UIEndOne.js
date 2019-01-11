

cc.Class({
    extends: cc.Component,

    properties: {
        ImgHead:cc.Sprite,
        TxtScore:cc.Label,
        TxtName:cc.Label,

        UINode:cc.Node,
        UIWinNode:cc.Node,
    },

    Clear()
    {
        this.UINode.active = false;
        this.UIWinNode.active = false;
    },

    onLoad()
    {
        this.UpLayout = this.node.parent;
        this.AdpativeUI();
    },

    AdpativeUI()
    {
        if(this.IsAdpative==undefined)
        {
            let sysInfo = window.wx.getSystemInfoSync();
            let width = sysInfo.screenWidth;
            let height = sysInfo.screenHeight;
            if(height/width>2)
            {
                var mpos =  this.UpLayout.getPosition();
                var pos = cc.v2(mpos.x,mpos.y+80);
                //需要适配
                this.UpLayout.setPosition(pos);
            }
            this.IsAdpative = true;
        }
        
    },

    init(data)
    {
        this.UINode.active = true;
        let avatarUrl = data.avatarUrl;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.createImage(avatarUrl);
        this.TxtScore.string = grade+"分";
        let nick = data.nickname.length <= 4 ? data.nickname : data.nickname.substr(0, 4) + "...";
        this.TxtName.string = nick;
    },
    
    createImage(avatarUrl) {
        let image = window.wx.createImage();
        var self = this;
        image.onload = function(){
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            self.ImgHead.spriteFrame = new cc.SpriteFrame(texture);
        };
        
        image.src = avatarUrl;
    } ,

    Win()
    {
        this.UIWinNode.active = true;
    }
});
