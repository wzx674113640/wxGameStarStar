
cc.Class({
    extends: cc.Component,

    properties: {
        prefabRankItem: cc.Prefab,
        scrollViewContent: cc.Node,
        myRankingItem: cc.Node,

        FriendRank:cc.Node,

        UIEndOne: cc.Node,
        UIEndTwo: cc.Node,
        
        Content: cc.Node,
        LayoutNode: cc.Node,
        
        RankingScrollView:cc.ScrollView,

        _MaxScore:-1,
    },
  

    start () {
        cc.find("Canvas").y = 667;
        window.wx.onMessage(data => {
            if (data.messageType == 0) {//移除排行榜
                this.removeChild();
            } else if (data.messageType == 1) {//获取好友排行榜
                this.fetchFriendData(data.MAIN_MENU_NUM);
            } else if (data.messageType == 3) {//提交得分
                this.saveUserInfo(data.MAIN_MENU_NUM, data.score);
            } else if (data.messageType == 4) {//获取好友排行榜横向排列展示模式
                this.ShowUITwo();
            } else if (data.messageType == 5) {//显示即将超越的好友
                this.ShowUIOne();
                //this.fetchGroupFriendData(data.MAIN_MENU_NUM, data.shareTicket);//获取群排行榜
            }
            else if(data.messageType == 6)//好友排行置顶
            {
                this.ShowRankingTop();
            }
            else if(data.messageType == 7)//清理排行榜
            {
                this.clearRanking();
            }
            else if(data.messageType == 8)
            {
                this.gameOverRank(data.MAIN_MENU_NUM,data.score);
            }
            else if(data.messageType == 9)
            {
                this._MaxScore = -1;
            }
            else if(data.messageType == 10)
            {
                this.CloseAll();
            }
        });
    },

    gameOverRank(MAIN_MENU_NUM,score)
    {
        if(score<this._MaxScore)
            return;
        //清空信息  
        
        this.UIEndOne.getComponent("UIEndOne").Clear();
        this.UIEndTwo.getComponent("UIEndTwo").Clear();
        if(window.wx) {
            window.wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });
                            var lastsocre = false;

                            var smalldata = null;
                           
                            var isfirst = false;
                            for (let i = 0; i < data.length; i++) {
                                if(data[i].KVDataList[0].value<score&&lastsocre == false)
                                {
                                    if(i>0)
                                    {   
                                        smalldata = data[i-1];
                                        if(smalldata.avatarUrl == userData.avatarUrl)
                                        {
                                            if(i>1)
                                            {
                                                smalldata = data[i-2];
                                            }
                                            else
                                            {
                                                isfirst = true;
                                                //好友排名第一名  仅小于自己的最高排名(自己本来就是第一)
                                            }
                                        }
                                    }
                                    else
                                    {
                                        isfirst = true;
                                        //好友排名第一名 分数比最高分要高(自己有可能是第一也有可能不为第一)；
                                    }
                                    lastsocre = true;
                                }

                                if (data[i].avatarUrl == userData.avatarUrl) {
                                  
                                    //第一名的情况
                                    if(i == 0)
                                    {
                                        //this.UIEndOne.getComponent("UIEndOne").Win();
                                        var UITwo =  this.UIEndTwo.getComponent("UIEndTwo");
                                        UITwo.setSelf(i+1,data[i]);
                                        if(data.length>=2)
                                        {
                                            UITwo.setLeft(i+2,data[i+1]);
                                        }
                                    }
                                    //最后一名
                                    else if(i == data.length -1)
                                    {
                                        //this.UIEndOne.getComponent("UIEndOne").init(data[i-1]);
                                        //EndTwo 只显示右边的data[i-1]和自己的data[i]
                                        var UITwo =  this.UIEndTwo.getComponent("UIEndTwo");
                                        UITwo.setSelf(i+1,data[i]);
                                        if(data.length>=2)
                                        {
                                            UITwo.setRight(i,data[i-1]);
                                        }
                                    }
                                    else
                                    {
                                        
                                         //EndOne 超越榜正常显示
                                         //this.UIEndOne.getComponent("UIEndOne").init(data[i-1]);
                                         //EndTwo 正常显示
                                         var UITwo =  this.UIEndTwo.getComponent("UIEndTwo");
                                         UITwo.setRight(i,data[i-1]);
                                         UITwo.setSelf(i+1,data[i]);
                                         UITwo.setLeft(i+2,data[i+1]);
                                    }
                                }
                            }
                            
                            if(data.length <= 1||isfirst == true)
                            {
                                this.UIEndOne.getComponent("UIEndOne").Win();
                                this._MaxScore = 99999999;
                            }
                            //空的 则此人为最后一名
                            else 
                            {
                                
                                if(smalldata== null)
                                {
                                    var _date = data[data.length-1];
                                    if(_date.avatarUrl == userData.avatarUrl)
                                    {
                                        _date = data[data.length-2];
                                    }
                                    this.UIEndOne.getComponent("UIEndOne").init(_date);
                                    let score  = _date.KVDataList.length != 0 ? _date.KVDataList[0].value : 0;
                                    this._MaxScore = score;
                                }
                                else
                                {
                                    this.UIEndOne.getComponent("UIEndOne").init(smalldata);
                                    let score  = smalldata.KVDataList.length != 0 ? smalldata.KVDataList[0].value : 0;
                                    this._MaxScore = score;
                                }
                                    
                            }
                           
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail");
                            //this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        },
                    });
                },
                fail: (res) => {
                    //this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });

        }
       
    },

    ShowUIOne()
    {
        //显示第一页
        this.UIEndOne.active = true;
        this.UIEndTwo.active = false;
        this.FriendRank.active = false;
    },

    //显示第二页
    ShowUITwo()
    {
        this.UIEndOne.active = false;
        this.UIEndTwo.active = true;
        this.FriendRank.active = false;
    },

    CloseAll()
    {
        this.UIEndOne.active = false;
        this.UIEndTwo.active = false;
        this.FriendRank.active = false;
    },

    //保存用户信息
    saveUserInfo(MAIN_MENU_NUM,score)
    { 
        window.wx.getUserCloudStorage({
            // 以key/value形式存储
            keyList: [MAIN_MENU_NUM],
            success: function (getres) {
                if (getres.KVDataList.length != 0) {
                    if (getres.KVDataList[0].value > score) {
                        return;
                    }
                }
                // 对用户托管数据进行写数据操作
                window.wx.setUserCloudStorage({
                    KVDataList: [{key: MAIN_MENU_NUM, value: "" + score}]
                });
            },
        });
      
    },

   

    removeFriendChild()
    {
        this.scrollViewContent.removeAllChildren();
    },

    ShowRankingTop()
    {
        this.RankingScrollView.scrollToTop(0);
    },

    clearRanking()
    {
        var chidrens =this.scrollViewContent.children;
        for(var i = 0;i< chidrens.length;i++)
        {
            chidrens[i].getComponent('RankItem').clear();
        }
    },
    
    fetchFriendData(MAIN_MENU_NUM) 
    {
        this.UIEndOne.active = false;
        this.UIEndTwo.active = false;
        var self = this;
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: (userRes) => {
                let userData = userRes.data[0];
                //取出所有好友数据
                wx.getFriendCloudStorage({
                    keyList: [MAIN_MENU_NUM],
                    success: res => {
                        let data = res.data;
                        data.sort((a, b) => {
                            if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                return 0;
                            }
                            if (a.KVDataList.length == 0) {
                                return 1;
                            }
                            if (b.KVDataList.length == 0) {
                                return -1;
                            }
                            return b.KVDataList[0].value - a.KVDataList[0].value;
                        });

                        for(let i = 0; i < data.length; i++)
                        {
                            if(data[i].avatarUrl == userData.avatarUrl)
                            {
                                this.myRankingItem.getComponent('MyItem').init(i, data[i]);
                            }
                        }
                        self.worldData = data;
                        self.FriendRank.active = true;
                        this.myRankingItem.active = true
                        var scorll = self.RankingScrollView.getComponent(cc.ScrollView);
                        scorll.stopAutoScroll();
                        scorll.scrollToTop(0);
                        self.FriendRank.getComponent("UIRanking1").initialize();
                        
                    },
                });
            },
            
        });
    },

});
