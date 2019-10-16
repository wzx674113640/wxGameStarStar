
var UserInfo = require("UserInfo");
var UIManage = require("UIManage");
var ShareAndVideo = require("ShareAndVideo");
var getInfo = {code:null,nickName:null,avatarUrl:null,gender:null};
var AppIDInfo = require("AppIDInfo");
var Helper = require("Helper");
cc.Class({
    extends: cc.Component,

    properties: {
        ChilrenView:cc.Sprite,
        WXSUB:cc.WXSubContextView,
        loadUI:cc.Node,
        Mask:cc.Node,
        SmallChilrenView:cc.Sprite,
        _updateFrae:0.1,
        _updateFrameCool:0.1,
        _version:105,//版本号

        _width:750,
        _height:1334,

        _Sence:0,
        _AppIDInfoList:[],
    },

   

    start() {
        UIManage.Instance.ShowGameStart();
        this._version = 105;
        this.isShow = false;
        this.closeUpdate = false;
        this.isAlreadyLogin = false;
        this.playInfo = new UserInfo();
        if(!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        this.tex = new cc.Texture2D();
        
        window.sharedCanvas.width = 750;
        window.sharedCanvas.height = 1334;
        
        var obj = wx.getLaunchOptionsSync();
        
        var Sence = obj.query.scene == undefined? null:obj.query.scene;
        this._Sence = decodeURIComponent(Sence);
        this.OtherUID = obj.query.UID == undefined? null:obj.query.UID;
        this.C2G_GetUserInfo();
    },

    getScreen()
    {
        if(!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        let sysInfo = window.wx.getSystemInfoSync();
        this._width = sysInfo.screenWidth;
        this._height = sysInfo.screenHeight;
        this.SmallChilrenView.node.width = this._width;
        this.SmallChilrenView.node.height = this._height;
    },

    
    //获取后台信息
    C2G_GetUserInfo()
    {
        if (!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        if(this.isAlreadyLogin == false)
        {   
            this.ShowMask();
        }
        
        if(cc.sys.localStorage.getItem("nickName")!= "")
        {
            var self = this;
            getInfo.nickName = cc.sys.localStorage.getItem("nickName")
            getInfo.avatarUrl = cc.sys.localStorage.getItem("avatarUrl")
            getInfo.gender = cc.sys.localStorage.getItem("gender")
            self.Login(getInfo,self);
        }
        else{
            if(cc.sys.localStorage.getItem("IsFirst") == "")
            {
                //打开新手礼包
                this.Login(getInfo,this);
                
                UIManage.Instance.ShowGiftBag();
            }
            else
            {
                var self = this;
                if(this.isAlreadyLogin == false)
                {
                    this.Login(getInfo,self);
                }
                let sysInfo = window.wx.getSystemInfoSync();
                let width = sysInfo.screenWidth;
                let height = sysInfo.screenHeight;
               
                var ipx = 750/width,
                _top = (height*ipx/2 + 238.2 - 44.5)/ipx, //553 y，48 宽除以2
                _left = (width*ipx/2 + 307 - 44.5)/ipx; //216.2 x
                
                let button = wx.createUserInfoButton({
                    type: 'text',
                    text: '',
                    style: {
                        left: _left,
                        top: _top,
                        width: 89/ipx,
                        height: 89/ipx,
                        textAlign: 'center', 
                    }
                })
                self.button = button;
                button.onTap((res) => {
                    if(res.userInfo)
                    {
                        var userInfo = res.userInfo
                        cc.sys.localStorage.setItem("nickName", userInfo.nickName);
                        cc.sys.localStorage.setItem("avatarUrl", userInfo.avatarUrl);
                        cc.sys.localStorage.setItem("gender", userInfo.gender);
                        getInfo.nickName = userInfo.nickName
                        getInfo.avatarUrl = userInfo.avatarUrl
                        getInfo.gender = userInfo.gender //Sex 0: unknown, 1: male, 2: female
                        button.destroy();
                        self.button = null;
                        self.Login(getInfo,self,false);
                    }
                })
            }
        }
    },
    
    IsShowButton(active)
    {
        if(this.button == null||this.button == undefined)
            return;
        if(active)
        {
            this.button.show();
        }
        else
        {   
            this.button.hide();
        }
    },

    Login(getInfo,self,isReqGameInfo = true)
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
                    scene:self._Sence,
                    //uid: self.key
                    uid: self.OtherUID,
                    },
                    success (res) {
                    self.isAlreadyLogin = true;//是否登录过
                    var severuserinfo =  res.data.data;
                    
                    self.playInfo.openid = severuserinfo.openid,
                    self.playInfo.id = severuserinfo.id;
                    self.playInfo.nickName = severuserinfo.nickName;
                    self.playInfo.avatar_url = severuserinfo.avatar_url;
                    self.playInfo.score = severuserinfo.score;
                    self.IsGetUserInfo = true;
                    if(isReqGameInfo)
                    { 
                        self.C2G_GameInfo();
                    }  
                    //self.C2G_Redlog();
                    },
                    fail()
                    {
                        self.HideMask();
                        wx.showToast({
                            title: "网络数据请求失败",
                            icon: 'success',
                            duration: 800
                        })
                    }
                })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }  
            }
        })
    },

    C2G_AppID()
    {
        if (!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        var self =this; 
        wx.request({
            url: 'https://xxx.qkxz.com/index.php?act=gamelist',
            data:
            {
                openid: self.playInfo.openid,
                version:self._version
            },
            success (res) 
            {
                var data = res.data.data;
                
                self._AppIDInfoList = data.gamelist;
                
                //数据接收完成
                if(self.isLoadStart == undefined)
                {   
                    self.isLoadStart = true;
                    UIManage.Instance.OpenStartUI(); //显示渠道
                }
               
                //ShareAndVideo.Instance.HidePanelMask(1);
            }
          })
    },

    randomsort(a, b) {
        return Math.random()>.5 ? -1 : 1;
        //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
    },

    SetAppItem()
    {
        var AppIDInfoList = this._AppIDInfoList;
        
        AppIDInfoList.sort(this.randomsort);
        
        return AppIDInfoList;
    },

    C2G_GameStart()
    {
        if (!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        var self =this; 
        wx.request({
            url: 'https://xxx.qkxz.com/?act=index&openid={$openid}',
            data:
            {
                openid: self.playInfo.openid,
                version:self._version
            },
            success (res) {
                self.gameID = res.data.data.id;
            }
          })
    },

    //C2G游戏结束
    C2G_GameOver(Score,level,action = null)
    {
        if (!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        var self = this;
        wx.request({
            url: 'https://xxx.qkxz.com/?act=end&openid={$openid}',
            data:
            {
                openid:self.playInfo.openid,
                score: Score,
                id : self.gameID,
                gold: 0,
                version:self._version,
                level:level
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
        if (!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        var self = this;
        wx.request({
            url:'https://xxx.qkxz.com/?act=user',
            data:
            {
                openid:self.playInfo.openid,
                uid:null,
                version:self._version,
                scene:self._Sence,
            },
            success (res) 
            {
                var infodata =  res.data.data;
                self.playInfo._is_status = infodata.is_status;
                self.playInfo.is_share = infodata.is_share; 
                self.playInfo.count = Number(infodata.count);
                var n = Number(infodata.money);
                self.playInfo.money = n;//总金额
                self.HideMask();
                self.C2G_AppID();
                self.views = infodata.views;
                if(self.views.id!= null)
                {
                    //打开跳转其他游戏弹窗
                    UIManage.Instance.ShowOtherGamePanel();
                }
                
            },
            fail()
            {
                self.HideMask();
                wx.showToast({
                    title: "网络数据请求失败",
                    icon: 'success',
                    duration: 800
                })
            }
        });
    },

   

//红包钱数
    C2G_Redlog(action)
    {
        if (!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        var self = this;
        wx.request({
            url:'https://xxx.qkxz.com/?act=redlog&openid={openid}',
            data:
            {
                openid:self.playInfo.openid,
                version:self._version
            },
            success (res) 
            {
                var infodata =  res.data.data;
                if(infodata.length!=0)
                {
                    self.playInfo.money = Number(infodata.total_money);
                    self.playInfo.count = Number(infodata.count);//红包总金额
                    self.playInfo.getMoney =Number(infodata.money);
                    action();
                }
               
            }
        });
    },
 
    // 显示好友排行
    ShowFrindRanking(IsRequ = true)
    {
        if(!CC_WECHATGAME || Helper.Instance.IsQQ())
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
        if(!CC_WECHATGAME || Helper.Instance.IsQQ())
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
        if(!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        window.wx.postMessage({
            messageType: 9,
            MAIN_MENU_NUM: "x1"
        });
    },

    ShowOne()
    {
        return;
        if(!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        this.ShowSmallChild(false);
        window.wx.postMessage({
            messageType: 5,
            MAIN_MENU_NUM: "x1",
        });
    },

    ShowTwo()
    {
        if(!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        this.ShowChild(true);
        window.wx.postMessage({
            messageType: 4,
            MAIN_MENU_NUM: "x1",
        });
    },
    //提交分数
    SubmitScore(curscore,level)
    {
        if(!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        this.C2G_GameOver(curscore,level);
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

    ShowSmallChild()
    {
        if (window.sharedCanvas != undefined&&window.sharedCanvas!=null) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.ChilrenView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
        this.SmallChilrenView.spriteFrame = this.ChilrenView.spriteFrame;
        this.SmallChilrenView.node.active = true;
        this.ChilrenView.node.active = false;
        this.isShow = false;
    },

    //关闭子域
    HideChild()
    {
        this.isShow = false;
        this.SmallChilrenView.node.active = false;
        this.ChilrenView.node.active = false;
        if(!CC_WECHATGAME || Helper.Instance.IsQQ())
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
        if(Helper.Instance.IsQQ())
            return;
        if (window.sharedCanvas != undefined&&window.sharedCanvas!=null) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.ChilrenView.spriteFrame = new cc.SpriteFrame(this.tex);
            this.ChilrenView.node.active = true;
            this.SmallChilrenView.node.active = false;
        }
    },
    
    associatedProgram(AppID,url,ID)
    {
        var self = this;
        wx.navigateToMiniProgram({
            appId: AppID,
            path: url,
            envVersion: 'release',
            success(res) {
                wx.request({
                    url: "https://xxx.qkxz.com/index.php?act=cgame",
                    data: {
                      openid: self.playInfo.openid,
                      version: self._version,
                      id: ID,
                      appid:AppID
                    },
                  });
            }
          })
    }, 

//告诉后台我打开了那个APP
    CG2_AppReqCount(ID)
    {
        if (!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        var self = this;
        wx.request({
            url:'https://xxx.qkxz.com/index.php?act=game',
            data:
            {
                openid:self.playInfo.openid,
                version:self._version,
                id:ID,
            },
            success (res) 
            {
                
            }
        });
    },

    ShowMask()
    {
        this.Mask.active = true;
        this.loadUI.active = true;
        var m = cc.rotateBy(0.5, 180);
        var re = cc.repeatForever(m)
        this.loadUI.runAction(re);
    },

    HideMask()
    {
        this.Mask.active = false;
        this.loadUI.active = false;
    },

    //福利统计
    CG2_DailyWelfare()
    {       
        if (!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        var self = this;
        wx.request({
            url:'https://xxx.qkxz.com/index.php?act=fdcount',
            data:
            {
                openid:self.playInfo.openid,
                version:self._version,
            },
            success (res) 
            {
                
            }
        });
    },

    CG2_ShareFriendList(action)
    {       
        if (!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        var self = this;
        wx.request({
            url:'https://xxx.qkxz.com/index.php?act=friendlist',
            data:
            {
                openid:self.playInfo.openid,
                version:self._version,
            },
            success (res) 
            {
                action(res.data.data);
            }
        });
    },

    CG2_ShareFriendreg(action,id)
    {       
        if (!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        var self = this;
        wx.request({
            url:'https://xxx.qkxz.com/index.php?act=friendreg',
            data:
            {
                openid:self.playInfo.openid,
                version:self._version,
                id:id
            },
            success (res) 
            {
                action();
            }
        });
    },

    CG2_FDcount()
    {       
        if (!CC_WECHATGAME || Helper.Instance.IsQQ())
            return;
        var self = this;
        wx.request({
            url:'https://xxx.qkxz.com/index.php?act=fdcount',
            data:
            {
                openid:self.playInfo.openid,
                version:self._version,
            },
            success (res) 
            {
                
            }
        });
    },

});
