
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
        
        /*
        image.src = avatarUrl;
        var index = -1;
        for(var i = 0;i < this.StrList.length;i++)
        {
            if(this.StrList[i] == avatarUrl)
            {
                index = i;
                return;
            }
        }
        if(index==-1)
        {
            let image = window.wx.createImage();
            var self = this;
            image.onload = function(){
                let texture = new cc.Texture2D();
                texture.initWithElement(image);
                texture.handleLoadedTexture();
                ImgHead.spriteFrame = new cc.SpriteFrame(texture);
                self.StrList.push(avatarUrl);
                self.ImgList.push(ImgHead.spriteFrame);
            };
            image.src = avatarUrl;
        }
        else
        {
            ImgHead.spriteFrame = this.ImgList[index];
        }
        */
    } ,

});
