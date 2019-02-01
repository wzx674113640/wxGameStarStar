var ShareAndVideo = require("ShareAndVideo");
var FileServe = require("FileServe");

cc.Class({
    extends: cc.Component,

    properties: {
        BtnVideo:cc.Node,
        BtnShare:cc.Node
    },

     Show()
     {
         if(FileServe.Instance.GetAllVideoCount()<=0)
         {
            this.BtnVideo.active = true;
            this.BtnShare.active = false;
         }
         else
         {
            var value = Math.floor(Math.random()*10);
            if(value <=3)
            {
                this.BtnVideo.active = true;
                this.BtnShare.active = false;
            }
            else
            {
                this.BtnVideo.active = true;
                this.BtnShare.active = false;
            }
         }
         
     }
     

});
