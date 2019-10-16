

cc.Class({
    extends: require("BasePopUI"),

    properties: {
        
    },

    
    start () {
        this.GameInit = this.node.parent.parent.getComponent("GameInit");
        this.IsStart = false;
        this.CloseAction = ()=>
        {
            this.IsStart = false;
        };
    },

    Close()
    {
        this._super();
    },

    BtnYes()
    {
        if(this.IsStart)
        {
            return;
        }
        this.IsStart = true;
        this.GameInit.GameStart(true);
        this.Close();
    },

    BtnNo()
    {
        if(this.IsStart)
        {
            return;
        }
        this.IsStart = true;
        cc.sys.localStorage.removeItem("ItemCacheList");
        cc.sys.localStorage.removeItem("PlayInfo");
        this.GameInit.GameStart(false);
        this.Close();
    }
});
