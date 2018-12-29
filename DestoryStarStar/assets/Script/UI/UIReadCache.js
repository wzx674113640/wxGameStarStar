

cc.Class({
    extends: require("BasePopUI"),

    properties: {
        
    },

    
    start () {
        this.GameInit = this.node.parent.parent.getComponent("GameInit");
    },

    BtnYes()
    {
        this.GameInit.GameStart(true);
        this.Close();
    },

    BtnNo()
    {
        cc.sys.localStorage.removeItem("ItemCacheList");
        cc.sys.localStorage.removeItem("PlayInfo");
        this.GameInit.GameStart(false);
        this.Close();
    }
});
