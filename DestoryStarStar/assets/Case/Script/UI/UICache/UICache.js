
var FileServe = require("FileServe");
cc.Class({
    extends: cc.Component,

    properties: {
        ItemUIList:[cc.Node],
    },

    Show()
    {
        //cc.sys.localStorage.removeItem("PlayInfoList");
        //cc.sys.localStorage.removeItem("ItemCachePosList");
        for(var i = 0;i<this.ItemUIList.length;i++)
        {
            var value =  FileServe.Instance.GetCachePlayInfo(i);
            if(value!=false)
            {
                  this.ItemUIList[i].getComponent("CacheItem").SetItem(value._Level,value._Score,value.isGameOver,i);
            }
            else
            {
                this.ItemUIList[i].active = false;
            }
        }
        this.node.active = true;
    },
    Close()
    {
        this.node.active = false;
    }
});
