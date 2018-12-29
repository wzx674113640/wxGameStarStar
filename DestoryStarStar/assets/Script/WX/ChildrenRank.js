
var UserInfo = require("UserInfo");
var getInfo = {code:null,nickName:null,avatarUrl:null,gender:null};
cc.Class({
    extends: cc.Component,

    properties: {
        ChilrenView:cc.Sprite,
    },

    start () {
        this.isShow = false;
        if(!CC_WECHATGAME)
            return;
        window.wx.showShareMenu({withShareTicket: true});
        this.tex = new cc.Texture2D();
        window.sharedCanvas.width = 750;
        window.sharedCanvas.height = 1334;
        this.C2G_GetUserInfo();
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
                    }
                })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
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

    // 显示好友排行
    ShowFrindRanking(IsRequ = true)
    {
        if(!CC_WECHATGAME)
            return;
        this.ShowChild();
        if(IsRequ) //防止重复请求数据
        {
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "x1"
            });
        }
       
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
    ShowChild()
    {   
        this.isShow =true;
        this.ChilrenView.node.active = true;
    },

    //关闭子域
    HideChild()
    {
        this.isShow = false;
        this.ChilrenView.node.active =false;
    },

    update()
    {
        if(this.isShow == false)
            return;
        if (window.sharedCanvas != undefined&&window.sharedCanvas!=null) {
            
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.ChilrenView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    }
});
