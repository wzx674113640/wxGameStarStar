
var UserInfo = require("UserInfo");
var UIManage = require("UIManage");
var getInfo = {code:null,nickName:null,avatarUrl:null,gender:null};
cc.Class({
    extends: cc.Component,

    properties: {
        ChilrenView:cc.Sprite,
        WXSUB:cc.WXSubContextView,
        _updateFrae:0.1,
        _updateFrameCool:0.1,
        _version:103,//版本号

        _width:750,
        _height:1334
    },

    start () {
        this._version = 103;
        this.isShow = false;
        this.closeUpdate = false;
        if(!CC_WECHATGAME)
            return;
        //window.wx.showShareMenu({withShareTicket: true});
        this.tex = new cc.Texture2D();
        //this.getScreen();
        window.sharedCanvas.width = 750;
        window.sharedCanvas.height = 1334;
        
        //const openDataContext = wx.getOpenDataContext();
        //const sharedCanvas = openDataContext.canvas;
        //if (sharedCanvas) {
        //    sharedCanvas.width = cc.game.canvas.width * 2;
        //    sharedCanvas.height = cc.game.canvas.height * 2;
        //}
        this.C2G_GetUserInfo();
    },

    getScreen()
    {
        if(!CC_WECHATGAME)
            return;
        let sysInfo = window.wx.getSystemInfoSync();
        this._width = sysInfo.screenWidth;
        this._height = sysInfo.screenHeight;
    },

   
    
    //获取后台信息
    C2G_GetUserInfo()
    {
        this.playInfo = new UserInfo();
        if (!CC_WECHATGAME)
            return;
        if(cc.sys.localStorage.getItem("nickName")!= "")
        {
            var self = this;
            getInfo.nickName = cc.sys.localStorage.getItem("nickName")
            getInfo.avatarUrl = cc.sys.localStorage.getItem("avatarUrl")
            getInfo.gender = cc.sys.localStorage.getItem("gender")
            self.Login(getInfo,self);
        }
        else{
            var self = this;
            let sysInfo = window.wx.getSystemInfoSync();
            let width = sysInfo.screenWidth;
            let height = sysInfo.screenHeight;
            let button = wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: 10,
                    top: 10,
                    width: width - 20,
                    height: height - 20,
                    textAlign: 'center'
                }
            })
            button.onTap((res) => {
                var userInfo = res.userInfo
                cc.sys.localStorage.setItem("nickName", userInfo.nickName);
                cc.sys.localStorage.setItem("avatarUrl", userInfo.avatarUrl);
                cc.sys.localStorage.setItem("gender", userInfo.gender);
                getInfo.nickName = userInfo.nickName
                getInfo.avatarUrl = userInfo.avatarUrl
                getInfo.gender = userInfo.gender //Sex 0: unknown, 1: male, 2: female
                button.hide();
                //直接游戏
                if(this.isbtnStart==undefined)
                {
                    UIManage.Instance.UIList["UIStart"].getComponent("UIStart").BtnGameStart();
                    this.isbtnStart = true;
                }
                self.Login(getInfo,self);
            })
        }
    },

    Login(getInfo,self)
    {
        wx.login({
            success (res) {
                if (res.code) {
                getInfo.code = res.code
                //发起网络请求
                wx.request({
                    url: 'https://xxx.qkxz.com/index.php?act=userinfo',
                    data: {
                    code: getInfo.code,
                    nickName:getInfo.nickName,
                    avatarUrl: getInfo.avatarUrl,
                    gender:getInfo.gender,
                    scene:0,
                    //uid: self.key
                    uid:0,
                    },
                    success (res) {
                    var severuserinfo =  res.data.data;
                    
                    //this.PlayInfo.curSkin = 0;
                    self.playInfo.openid = severuserinfo.openid,
                    self.playInfo.id = severuserinfo.id;
                    self.playInfo.nickName = severuserinfo.nickName;
                    self.playInfo.avatar_url = severuserinfo.avatar_url;
                    self.playInfo.score = severuserinfo.score;
                    self.IsGetUserInfo = true;
                    self.C2G_GameInfo();
                    //self.C2G_Redlog();
                    
                    }
                })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }  
            }
        })
    },

    C2G_GameStart()
    {
        if (!CC_WECHATGAME)
            return;
        var self =this; 
        wx.request({
            url: 'https://xxx.qkxz.com/?act=index&openid={$openid}',
            data:
            {
                openid: self.playInfo.openid,
            },
            success (res) {
            }
          })
    },

    //C2G游戏结束
    C2G_GameOver(Score,action = null)
    {
        if (!CC_WECHATGAME)
            return;
        var self = this;
        wx.request({
            url: 'https://xxx.qkxz.com/?act=end&openid={$openid}',
            data:
            {
                openid:self.playInfo.openid,
                score: Score,
                id : self.gameID,
                gold: 0
            },
            success (res) {
                if(action!=null)
                {
                    action(); 
                }
            }
          })
    },

    C2G_GameInfo()
    {
        if (!CC_WECHATGAME)
            return;
        var self = this;
        wx.request({
            url:'https://xxx.qkxz.com/?act=user',
            data:
            {
                openid:self.playInfo.openid,
                uid:null,
                version:self._version
            },
            success (res) 
            {
                var infodata =  res.data.data;
                self.playInfo._is_status = infodata.is_status;
                self.playInfo.count = Number(infodata.count);
                var n = infodata.money.toFixed(2);
                self.playInfo.money = n;//总金额
            }
        });
    },

//红包钱数
    C2G_Redlog(action)
    {
        if (!CC_WECHATGAME)
            return;
        var self = this;
        wx.request({
            url:'https://xxx.qkxz.com/?act=redlog&openid={openid}',
            data:
            {
                openid:self.playInfo.openid,
            },
            success (res) 
            {
                var infodata =  res.data.data;
                if(infodata.length!=0)
                {
                    var num =  Number(infodata.money);
                    num.toFixed(2);
                    self.playInfo.money += num;
                    self.playInfo.count = Number(infodata.count);//红包总金额
                    self.playInfo.getMoney = infodata.money.toFixed(2);
                    action();
                }
               
            }
        });
    },
 
    // 显示好友排行
    ShowFrindRanking(IsRequ = true)
    {
        if(!CC_WECHATGAME)
            return;
        this.ShowChild();
        this.isShow = true;
        if(IsRequ) //防止重复请求数据
        {
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "x1"
            });
        }
        //this._updateFrameCool = 0;
        //this.WXSUB.enbale = true;
    },
    
    ShowChildrenGameOver(score)
    {
        if(!CC_WECHATGAME)
            return;
        window.wx.postMessage({
            messageType: 8,
            MAIN_MENU_NUM: "x1",
            score: score,
        });
    },

//重置子域的最大分数
    ResetChildMaxScore()
    {
        if(!CC_WECHATGAME)
            return;
        window.wx.postMessage({
            messageType: 9,
            MAIN_MENU_NUM: "x1"
        });
    },

    ShowOne()
    {
        if(!CC_WECHATGAME)
            return;
        this.ShowChild(false);
        window.wx.postMessage({
            messageType: 5,
            MAIN_MENU_NUM: "x1",
        });
        //this._updateFrameCool = 1;
        //this.WXSUB.enbale = false;
        //this.isShow = false;
    },

    ShowTwo()
    {
        if(!CC_WECHATGAME)
            return;
        this.ShowChild(true);
        window.wx.postMessage({
            messageType: 4,
            MAIN_MENU_NUM: "x1",
        });
        //this._updateFrameCool = 1;
        //this.WXSUB.enbale = false;
        //this.isShow = false;
    },
    //提交分数
    SubmitScore(curscore)
    {
        this.C2G_GameOver(curscore);
        
        if(!CC_WECHATGAME)
            return;
        let score = curscore;
        window.wx.postMessage({
            messageType: 3,
            MAIN_MENU_NUM: "x1",
            score: score,
        });
    },
    //打开子域
    ShowChild(isAlwaysShow = true)
    {   
        if(isAlwaysShow == false)
        {
            this.isShow = false;
            this.updateChild();
            this.WXSUB.enbale = false;
        }
        else
        {
            this.isShow = true;
            this.WXSUB.enbale = true;
        }
    },

    //关闭子域
    HideChild()
    {
        this.isShow = false;
        this.ChilrenView.node.active =false;
        if(!CC_WECHATGAME)
            return;
        window.wx.postMessage({
            messageType: 10,
            MAIN_MENU_NUM: "x1",
        });
    },

    update(dt)
    {
        if(this.isShow == false)
            return;
        this.updateChild();
    },

    updateChild()
    {
        if (window.sharedCanvas != undefined&&window.sharedCanvas!=null) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.ChilrenView.spriteFrame = new cc.SpriteFrame(this.tex);
            this.ChilrenView.node.active = true;
        }
    }
   

});
