var UIManage = require("UIManage");
var ShareAndVideo = require("ShareAndVideo");

cc.Class({
    extends: cc.Component,
    properties: {
        //Content:cc.Node,//滑动试图的Content
        //ContentNode:cc.Node ,//Item的父对象
        ItemRankPrefabs:cc.Prefab, //Item预制体
        FTol:cc.Toggle,
        WTol:cc.Toggle,
        LTol:cc.Toggle,

        //LevelContent:cc.Node,
        //LevelContentNode:cc.Node,

    },

    onLoad () {
        //this.FTol = this.node.getChildByName("Toggles").getChildByName("FTol").getComponent(cc.Toggle);
        this.WRanking = this.node.getChildByName("WorldRankingView");
        this.LRanking = this.node.getChildByName("LevelRankingView");
        this.selfItem = this.node.getChildByName("SelfItem");
        this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
        this.IsRequ = true; //是否请求子域排行榜数据
    },


    ShareClick()
    {
        ShareAndVideo.Instance.AddShareEvent(()=>
        {
            
        });
    },

    Open()
    {
        this.node.active = true;
        
        //this.WTol.uncheck();
        this.FTol.isChecked = true;
        this.WTol.isChecked = false;
        this.LTol.isChecked = false;
        this.IsLoadJson = true;
        this.WRanking.active = false;
        this.selfItem.active = false;
        //TODO 显示子域的好友排行榜
        this.ChildrenRankCom.ShowFrindRanking(this.IsRequ);
        this.isRequ = false;
        
    },

    Close()
    {
        if(UIManage.Instance.SceneState == "Start")
        {
            this.ChildrenRankCom.HideChild();
        }
        else
        {
            UIManage.Instance.ShowGameoverUI();
        }
        this.isRequ = true;
        this.node.active= false;
    },

    LoadItem(RankingNode,index)
    {
        var childrens = RankingNode.children;
        if(childrens.length>index)
        {
            return childrens[index];
        }
        else
        {
            var iteminfo = cc.instantiate(this.ItemRankPrefabs);
            iteminfo.parent = RankingNode;
            return iteminfo;
        }
    },


    //显示世界排行榜
    ShowWorldRank()
    {
        //Todo隐藏子域好友排行榜、
        this.ChildrenRankCom.HideChild();
        var self = this;
        var _openID = this.ChildrenRankCom.playInfo.openid;
        if(this.IsLoadJson&&CC_WECHATGAME)
        {   
            //Todo 加载框
            ShareAndVideo.Instance.ShowPanelMask();
            wx.request(
                {
                    url:"https://xxx.qkxz.com/?act=paihang&openid={$openid}",
                    data:
                    {
                        openid: _openID//Todo
                    },
                    success(res)
                    {
                       var view = res.data.data.view;
                       self.selfItem.getComponent("MyselfItem").SetItem(view.num, view.avatar_url,view.nick_name,view.score);
                       self.worldData = res.data.data.list;
                       self.WRanking.active = true;
                       self.WRanking.getComponent("UIRanking1").initialize();
                    }   
                }
            )
        }
        self.selfItem.active = true;
        var scorll = self.WRanking.getComponent(cc.ScrollView);
        scorll.stopAutoScroll();
        scorll.scrollToTop(0);
        //Todo关闭加载框
        ShareAndVideo.Instance.HidePanelMask(0);
    },
    //显示关卡排行
    ShowLevelRank()
    {
        //Todo隐藏子域好友排行榜、
        this.ChildrenRankCom.HideChild();
        var self = this;
        var _openID = this.ChildrenRankCom.playInfo.openid;
        if(this.IsLoadJson&&CC_WECHATGAME)
        {   
            //Todo 加载框
            ShareAndVideo.Instance.ShowPanelMask();
            wx.request(
                {
                    url:"https://xxx.qkxz.com/index.php?act=paihang&type=2",
                    data:
                    {
                        openid: _openID//Todo
                    },
                    success(res)
                    {
                        var view = res.data.data.view;
                        self.selfItem.getComponent("MyselfItem").SetItem(view.num, view.avatar_url,view.nick_name,view.score,true);
                        self.worldData = res.data.data.list;
                        self.WRanking.active = true;
                        self.WRanking.getComponent("UIRanking1").initialize();
                    }
                }
            )
        }
        self.selfItem.active = true;
        var scorll = self.WRanking.getComponent(cc.ScrollView);
        scorll.stopAutoScroll();
        scorll.scrollToTop(0);
        //Todo关闭加载框
        ShareAndVideo.Instance.HidePanelMask(0);
    }


});
