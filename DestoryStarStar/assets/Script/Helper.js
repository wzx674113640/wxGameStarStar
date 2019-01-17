
var Helper  =  cc.Class({
    extends: cc.Component,

    statics:
    {
        Instance:null,
    },

    properties: {
    },

    onLoad()
    {
        Helper.Instance = this;
        this.urlList = [];
        this.sFlist = [];
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

    createAppImage(url,container) {
        var index = -1;
        for(var i = 0;i<this.urlList.length;i++)
        {
            if(url == this.urlList[i])
            {
                index = i;
                break;
            }
        }
        if(index==-1)
        {
            var self = this;
            cc.loader.load(url, function (err, texture) {
                var sprite  = new cc.SpriteFrame(texture);
                container.spriteFrame = sprite;
                self.urlList.push(url);
                self.sFlist.push(sprite);
            });
        }
        else
        {
            container.spriteFrame = this.sFlist[index];
        }
    }
});
