var ShareAndVideo = require("ShareAndVideo");
var FileServe = require("FileServe");

cc.Class({
    extends: cc.Component,

    properties: {
        BtnVideo:cc.Node,
        BtnShare:cc.Node
    },

     onEnable()
     {
         if(FileServe.Instance.GetAllVideoCount()<=0)
         {
            this.BtnVideo.active = false;
            this.BtnShare.active = true;
         }
         else
         {
            var value = Math.floor(Math.random()*10);
            if(value <=3)
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
         
     }
     

});
