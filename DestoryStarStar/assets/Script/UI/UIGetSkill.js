var ShareAndVideo = require("ShareAndVideo");
var FactoryItem = require("FactoryItem");
cc.Class({
    extends: require("BasePopUI"),

    properties: {
        BtnClose: cc.Node,
        BtnEnter:cc.Node,
        BtnShare:cc.Node,
    },


    Show()
    {
        this.node.active = true;
        this.Mask.active = true;
        this.BtnClose.active = true;
        this.BtnEnter.active = false;
        this.BtnShare.active= true;
    },

    Close()
    {
        this.node.active = false;
        this.Mask.active = false;

    },

    BtnShareClick()
    {
        ShareAndVideo.Instance.AddShareEvent(()=>
        {
            this.BtnClose.active = false;
            this.BtnEnter.active = true;
            this.BtnShare.active = false;
        });
    },

    BtnEnterClick()
    {
        this.Close();
        FactoryItem.Instance.DestorySameColorProps();
    },
});
