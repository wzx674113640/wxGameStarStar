var UIManage = require("UIManage");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    start()
    {
        this.GameInitCom = cc.find("Canvas").getComponent("GameInit");
        this.childrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },

    Show()
    {
        this.node.active = true;
    },

    Close()
    {
        this.node.active = false;
    },

    BtnStartGame()
    {
        this.Close();
        this.GameInitCom.realGamestart();
        this.childrenRankCom.C2G_GameStart();
        UIManage.Instance.UIList["UIStart"].getComponent("UIStart")._C2GAction = ()=>
        {
            this.childrenRankCom.C2G_GetUserInfo();
        }
        cc.sys.localStorage.setItem("IsFirst",1);
    }
});
