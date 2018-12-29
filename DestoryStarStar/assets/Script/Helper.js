
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
        var self = this;
        image.onload = function(){
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            ImgHead.spriteFrame = new cc.SpriteFrame(texture);
            ImgHead.node.active = true;
        };
        image.src = avatarUrl;
    } ,

});
