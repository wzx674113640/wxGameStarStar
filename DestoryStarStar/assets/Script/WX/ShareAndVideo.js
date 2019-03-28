
var FileServe = require("FileServe");

var SharePIC = [
    "https://img.qkxz.com/xxx/1.jpg",
    "https://img.qkxz.com/xxx/2.jpg",
    "https://img.qkxz.com/xxx/3.jpg",
    "https://img.qkxz.com/xxx/4.jpg",
    "https://img.qkxz.com/xxx/5.jpg",
    "https://img.qkxz.com/xxx/6.jpg",
    "https://img.qkxz.com/xxx/7.jpg",
    "https://img.qkxz.com/xxx/8.jpg",
]

var ShareStr = [
    "不是谁都能在这个游戏达到巅峰！",
    "消除对决，不服来战！",
    "下初雪时，任何谎言都可以被原谅。",
    "一亿人都在玩的消消乐游戏！",
    "这款消除游戏，突然之间就火了！",
    "消除游戏千千万，推荐它只因为：美  ！",
    "站着完，躺着玩，坐车玩，吃饭玩，睡觉玩，上课玩，上课不能玩",
    "就算给你这么多道具，你也达不到最高分。",
];

var ShareAndVideo =  cc.Class({
    extends: cc.Component,

    statics:
    {
        Instance : null,
    },

    properties: {
        PanelMask:cc.Node,
        FailUI:cc.Node,
        FailVedioUI:cc.Node,
        VideoErrorUI:cc.Node,
        NotRward:cc.Node,
    },
    
    GetNotRwardPos()
    {
        var pos = this.NotRward.getPosition();
        
        return pos;
    },

    onLoad()
    {   
        ShareAndVideo.Instance = this;
        this.ShareEvent = null;//分享的事件
        this.childrenRankCom = cc.find("wx").getComponent("ChildrenRank");
        if(CC_WECHATGAME)
        {
            var sysInfo = window.wx.getSystemInfoSync();
            this.screenHeight = sysInfo.screenHeight;
            this.screenWidth = sysInfo.screenWidth;
            this.windowWidth = sysInfo.windowWidth;
            this.ipx = 750/this.screenWidth;
            this.bannerAdHeight = 117; // 广告高度
        }
        
        if (CC_WECHATGAME)
        {
            this.SharaHideShow();
            this.videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-649c1f174c1ce79c'
            });
            var self = this;
           
           
            this.videoAd.onError(err => {
                self.HidePanelMask(1.5);
                self.showVideoFailUI();
                if(self.action!= null)
                {
                    self.action();
                    self.action == null;
                }
                self.isSeeVideo = false;
            })
            

            var value = Math.floor(Math.random()*ShareStr.length);
            this.ShareImg = SharePIC[value];
            this.ShareString = ShareStr[value];
            var self = this;
            wx.onShareAppMessage(()=>{
                return {
                    title: self.ShareString,
                    imageUrl: self.ShareImg,
                    success(res){
                        var value = Math.floor(Math.random()*SharePIC.length);
                        this.ShareImg = SharePIC[value];
                        this.ShareString = ShareStr[value];
                    },
                    fail(res){
                        var value = Math.floor(Math.random()*SharePIC.length);
                        this.ShareImg = SharePIC[value];
                        this.ShareString = ShareStr[value];
                  }
                } 
            });
            wx.showShareMenu({
                withShareTicket: true
            });
        }
        this.Maskcallback = ()=>
        {
            if(!CC_WECHATGAME)
                return
            this.PanelMask.active = false;
            wx.hideLoading();
        }
        
    },

    AddShareEvent(action)
    {
        var value = Math.floor(Math.random() * ShareStr.length);
        this.ShareImg = SharePIC[value];
        this.ShareString = ShareStr[value];
        wx.shareAppMessage({
            title: this.ShareString,
            imageUrl: this.ShareImg,
            success(res){
            },
            fail(res){
            } 
        });
        this.ShareEvent = action;
    },
    SharaHideShow()
    {
        wx.onHide(()=>
        {
            var timeDate = new Date();
            this.hideTime = timeDate.getTime();
        })
        
        wx.onShow(()=>
        {
            var timeDate = new Date();
            var showTime = timeDate.getTime();
            var value = showTime - this.hideTime;
            if(value>3000)
            {
                if(this.ShareEvent!= null)
                {
                    wx.showToast({
                        title: "分享成功",
                        icon: 'success',
                        duration: 800
                      })
                    this.ShareEvent();
                    this.ShareEvent = null;
                }
            }
            else if(value<3000)
            {
                if(this.ShareEvent!= null)
                {
                    this.showShareFailUI();
                    /*
                    wx.showToast({
                        title: "请分享到不同的群",
                        icon: 'Fail',
                        duration: 800
                      })
                    */
                    this.ShareEvent = null;
                }
            }
        })
    },

    showShareFailUI()
    {
        this.FailUI.active = true;
        this.scheduleOnce(function()
        {
           this.FailUI.active = false;
        }, 1.2);
    },
    //看视频失败
    showSeeFailUI()
    {
        this.FailVedioUI.active = true;
        this.scheduleOnce(function()
        {
           this.FailVedioUI.active = false;
        }, 1.2);
    },
    //视频异常
    showVideoFailUI()
    {
        this.VideoErrorUI.active = true;
        this.scheduleOnce(function()
        {
           this.VideoErrorUI.active = false;
        }, 1.2);
    },
    
  
//广告
    ShowOrHideAdervert(Active)
    {
        if(!CC_WECHATGAME)
            return;
        if(Active)
        {
            var self = this;
            let bannerAd = wx.createBannerAd({
                adUnitId: 'adunit-2fb4290138df6a7c',
                style: {
                    left: 0,
                    top: self.screenHeight-130,
                    width: self.screenWidth,
                    height:200,
                }
                });
            bannerAd.onLoad(() => {
               
                bannerAd.style.top = self.screenHeight-bannerAd.style.realHeight;
                
                self.bannerAdHeight = bannerAd.style.realHeight;

                self.NotRward.getComponent(cc.Widget).bottom = self.bannerAdHeight * self.ipx;
                
                bannerAd.show();
            });
            
            bannerAd.onError(err => {
                //console.log(err)
            })

            this.bannerAd = bannerAd;
        }
        else
        {
            if(this.bannerAd!=null&&this.bannerAd!=undefined)
            {
                this.bannerAd.destroy();
                //this.bannerAd.hide();
            }
        }
    },

    AdervertActive(active)
    {
        if(this.bannerAd!=undefined)
        {
            if(active)
            {
                this.bannerAd.show();
            }
            else
            {
                this.bannerAd.hide();
            }
        }
    },

    ShareAndVideo(action)
    {
        /*
        if(FileServe.Instance.GetAllVideoCount()<=0)
        {   
            this.AddShareEvent(()=>
            {
                action();
            });
        }
        else
        {

        }
        */
        if(this.childrenRankCom.playInfo.is_share == 1 || this.childrenRankCom.playInfo.is_share == undefined)
        {
            if(FileServe.Instance.GetAllVideoCount()<=0)
            {   
                this.AddShareEvent(()=>
                {
                    action();
                });
            }
            else
            {
                this.SeeVedioClick(()=>
                {
                    action();
                });
            }
        }
        else
        {   
            this.SeeVedioClick(()=>
            {
                action();
            });
        }
    },

    //看视频
    SeeVedioClick(action,str=null,failAction)
    {
        this.ShowPanelMask();
        if(!CC_WECHATGAME)
            return;
        var self = this;
        this.action = action;
        this.failAction = failAction;
        this.str = str;
        this.videoAd.load().then(() => 
        {
            self.HidePanelMask(1.5);
        });
        this.videoAd.show().catch((err)=>
        {
           //self.videoAd.load().then(()=>self.videoAd.show());
        })
        this.videoAd.onClose(res => {
            self.videoAd.offClose();
            if (res && res.isEnded || res === undefined) {
                if(self.str != null)
                {
                    wx.showToast({
                        title: self.str,
                        icon: 'success',
                        duration: 800
                    })
                }
                 if(self.action!= null)
                {
                    self.action();
                    self.action == null;
                }
                //视频次数减一
                var value = cc.sys.localStorage.getItem("VideoCount");
                value--;
                cc.sys.localStorage.setItem("VideoCount",value);
            } 
            else {
                self.showSeeFailUI();
                if(self.failAction!= null)
                {
                    self.failAction();
                    self.action == null;
                }
            }
            self.isSeeVideo = false;
            //self.HidePanelMask(1.5);
        })
    },


    ShowPanelMask()
    {
        if(!CC_WECHATGAME)
            return
        this.unschedule(this.Maskcallback);
        this.PanelMask.active = true;
        
        wx.showLoading({
            title: "加载中",
        })
    },
    
    HidePanelMask(time)
    {
        if(!CC_WECHATGAME)
            return
        this.scheduleOnce(this.Maskcallback, time);
    },

});
module.exports = ShareAndVideo;