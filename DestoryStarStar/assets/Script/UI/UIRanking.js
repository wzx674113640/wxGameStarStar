var UIManage = require("UIManage");
var ShareAndVideo = require("ShareAndVideo");

cc.Class({
    extends: cc.Component,
    properties: {
        Content:cc.Node,//滑动试图的Content
        ContentNode:cc.Node ,//Item的父对象
        ItemRankPrefabs:cc.Prefab, //Item预制体
        FTol:cc.Toggle,
        WTol:cc.Toggle,
    },

    onLoad () {
        //this.FTol = this.node.getChildByName("Toggles").getChildByName("FTol").getComponent(cc.Toggle);
        this.WRanking = this.node.getChildByName("WorldRankingView");
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
        //清理世界排行榜的Item
        var childrens = this.ContentNode.children;
        for(var i = 0;i<childrens.length;i++)
        {
            childrens[i].getComponent("RankItem").Clear();
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
            //RankingNode.addChild(iteminfo);
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

            wx.request(
                {
                    url:"https://xxx.qkxz.com/?act=paihang&openid={$openid}",
                    data:
                    {
                        openid: _openID//Todo
                    },
                    success(res)
                    {
                        var obj = res.data.data.list;
                        var view = res.data.data.view;
                        for(var i = 0;i< obj.length;i++)
                        {
                            var iteminfo = self.LoadItem(self.ContentNode,i);
                            iteminfo.getComponent("RankItem").SetItem(obj[i].num, obj[i].avatar_url,obj[i].nick_name,obj[i].score);
                        }
                        // 设置排行榜滑动长度
                        if(self.ContentNode.children.length>=6)
                        {
                            var height = 677+(self.ContentNode.children.length-5)*119;
                            self.Content.setContentSize(682,height); 
                        }
                        else
                        {
                            self.Content.setContentSize(682,677);
                        }
                        
                        self.selfItem.getComponent("RankItem").SetItem(view.num, view.avatar_url,view.nick_name,view.score);
                        self.IsLoadJosn = false;
                    }
                }
            )
        }
        self.WRanking.active = true;
        self.selfItem.active = true;
        self.WRanking.getComponent(cc.ScrollView).scrollToTop(0);
        //Todo关闭加载框
    }

});
