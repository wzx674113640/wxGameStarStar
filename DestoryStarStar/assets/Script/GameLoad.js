
cc.Class({
    extends: cc.Component,

    properties: {
        ProgressBar:cc.ProgressBar,
        NumBar:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.LoadChildPack();
    },

    LoaderUIstart()
    {
        cc.director.loadScene("12.10");
        console.log("切换场景");
    },

    //加载子包
    LoadChildPack()
    {
        cc.loader.downloader.loadSubpackage("Case",(err)=>
        {
            if(err)
            {
                return console.error("分包加载失败");
            }
            //加载首页预制体
            this.LoadFirstPrefabs();
        })
    },

    LoadFirstPrefabs()
    {
        //cc.loader.loadRes('Prefabs/UIStart', cc.Prefab, this._progressCallback.bind(this),(err, prefab) => {
            //this.LoaderUIstart(prefab);
        //});
        cc.director.preloadScene("12.10",()=>
        {
            console.log("场景预加载完成");
        })
        
        cc.loader.loadResDir("Sound",cc.assets,function(completeCount, totalCount, res)
        {
            console.log("声音加载完成");  
        });

        cc.loader.loadResDir("Prefabs/UIPrefab",cc.assets,this._progressCallback.bind(this),(err, prefab) =>
        {
            console.log("UI加载完成");
            this.LoaderUIstart();
        });

        cc.loader.loadResDir("Prefabs/Item",cc.assets,function(completeCount, totalCount, res)
        {
            console.log("item加载完成");
        });
    },

    _progressCallback(completeCount, totalCount, res)
    {
        var value = completeCount / totalCount;
        if(value <=  this.ProgressBar.progress)
        {
            return;
        }
        this.ProgressBar.progress = value;
      
        this.NumBar.string = Math.ceil(value*100)+"%";
    },
});
