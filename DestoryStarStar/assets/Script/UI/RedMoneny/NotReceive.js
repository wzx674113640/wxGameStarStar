var ShareAndVideo = require("ShareAndVideo");

cc.Class({
    extends: cc.Component,

    properties: {
        BtnVideo:cc.Node,
        BtnShare:cc.Node
    },

     onEnable()
     {
         var value = Math.floor(Math.random()*2);
         if(value == 0 )
         {
            this.BtnVideo.active = false;
            this.BtnShare.active = true;
         }
         else
         {
            this.BtnVideo.active = true;
            this.BtnShare.active = false;
         }
     }


});
