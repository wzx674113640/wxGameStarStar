
var FileServe = require("FileServe");

var SharePIC = [
    "https://graph.baidu.com/resource/112d08be6b1a7de0d774601546858513.jpg",
    "https://graph.baidu.com/resource/1bc836d39b531256d31dc01546858489.jpg",
    "https://graph.baidu.com/resource/15572e698f3e043f7f9be01546858430.jpg",
    "https://graph.baidu.com/resource/10e22ce69808d71d0525201546858474.jpg",
    "https://graph.baidu.com/resource/148e46647ba650088f5e101547187219.jpg",
    "https://graph.baidu.com/resource/1b4c6abe412ddff71f98401547187530.jpg",
    "https://graph.baidu.com/resource/102d38f22f45ec3ac7dff01547633570.jpg",
    "https://graph.baidu.com/resource/104c44ea433f7c00756ee01548379593.jpg",
    "https://graph.baidu.com/resource/11ae28338d1dc3d6b119201547190683.jpg",
    "https://graph.baidu.com/resource/1b60daac8cbaa661fbd5c01547187761.jpg",
    "https://graph.baidu.com/resource/1e65565995b79ba143e3f01547187561.jpg",
    "https://graph.baidu.com/resource/1021beff7970a5efa3d8c01548921588.jpg",
    "https://graph.baidu.com/resource/102eb15c4e0df60de233d01548922417.jpg",
    "https://graph.baidu.com/resource/1027cf4fbbc1d2f671ab801548922645.jpg",
    "https://graph.baidu.com/resource/10260bcbb0ce3bb558ac401548923558.jpg",
    "https://graph.baidu.com/resource/102ff4288db93bf5aa96601548923596.jpg",
    "https://graph.baidu.com/resource/102845328159aa003a7db01548925239.jpg"
    
]

var ShareStr = [
    "小学生又出“神造句”,语文老师笑了,家长被气哭!",
    "据说这个游戏能玩到1个亿，你能达到这个小目标吗",
    "2018春节请假攻略,最长可休16天！",
    "2018年平均工资出炉,这次您又被平均了吗?",
    "买充气娃娃漏气报警 警方回应:110救不了你女朋友",
    "科学测试看到熊猫的视力都5.0",
    "女生必看!最新化妆品抽检结果出炉，这80批次都不合格。",
    "下个月开始独生子女具备5个条件就可以领钱",
    "时隔多年，2019年春晚节目居然又有他？",
    "2019年中国房租最贵十大城市排名一览",
    "99%的人都不会知道为什么A会是第一个死",
    "看图你能看到多少只动物？",
    "2019年全年公休放假安排",
    "12张色彩敏感测试图,只有1%的能人到第四关",
    "让999个老师吐血的神童试卷",
    "“神童”的考试卷火了,看到最后,网友:干的漂亮",
    "十二星座测试：你会选择下面哪一位做你未来的情人？"
];

var ShareAndVideo =  cc.Class({
    extends: cc.Component,

    statics:
    {
        Instance : null,
    },

    properties: {
        PanelMask:cc.Node,
        FailUI:cc.Node
        
    },
    
    onLoad()
    { 
        ShareAndVideo.Instance = this;
        this.ShareEvent = null;//分享的事件
       
        if (CC_WECHATGAME)
        {
            this.SharaHideShow();
            this.videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-649c1f174c1ce79c'
            });

            var value = Math.floor(Math.random()*11);
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

    },

    AddShareEvent(action)
    {
        var value = Math.floor(Math.random()*11);
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
//广告
    ShowOrHideAdervert(Active)
    {
        if(!CC_WECHATGAME)
            return;
        if(Active)
        {
            var screenHeight = wx.getSystemInfoSync().screenHeight
            var screenWidth = wx.getSystemInfoSync().screenWidth
            let bannerAd = wx.createBannerAd({
                adUnitId: 'adunit-2fb4290138df6a7c',
                style: {
                    left: 0,
                    top: screenHeight-130,
                    width: screenWidth,
                    height:200,
                }
                });
            bannerAd.onLoad(() => {
                
                bannerAd.style.top = screenHeight-bannerAd.style.realHeight;

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
        ShareAndVideo.Instance.SeeVedioClick(()=>
        {
            action();
        });
        return;

        if(FileServe.Instance.GetAllVideoCount()<=0)
        {   
            ShareAndVideo.Instance.AddShareEvent(()=>
            {
                action();
            });
        }
        else
        {
            var value = Math.floor(Math.random()*2);
            if(value == 0)
            {
                ShareAndVideo.Instance.SeeVedioClick(()=>
                {
                    action();
                });
            }
            else
            {
                ShareAndVideo.Instance.AddShareEvent(()=>
                {
                    action();
                });
            }
        }
    },

    //看视频
    SeeVedioClick(action,str=null,failAction)
    {
        this.ShowPanelMask();
        if(!CC_WECHATGAME)
            return;
        var self = this;
       
        this.videoAd.load().then(() => 
        {
            self.HidePanelMask(1);
        });
        this.videoAd.show().catch((err)=>
        {
           //self.videoAd.load().then(()=>self.videoAd.show());
        })
        this.videoAd.onError(err => {
            self.HidePanelMask(1);
            wx.showToast({
                title: '视频异常',
                icon: 'success',
                duration: 800
            })
            action();
        })
        this.videoAd.onClose(res => {
            self.videoAd.offClose();
            if (res && res.isEnded || res === undefined) {
                if(str != null)
                {
                    wx.showToast({
                        title: str,
                        icon: 'success',
                        duration: 800
                    })
                }
                action(); 
                //视频次数减一
                var value = cc.sys.localStorage.getItem("VideoCount");
                value--;
                cc.sys.localStorage.setItem("VideoCount",value);
            } 
            else {
                wx.showToast({
                    title: '没有看完视频',
                    icon: 'success',
                    duration: 800
                })
                if(failAction!=null)
                {
                    failAction();
                }
            }
            self.HidePanelMask(1);
        })
    },

    ShowPanelMask()
    {
        this.PanelMask.active = true;
        wx.showLoading({
            //title: "",
          })
    },

    HidePanelMask(time)
    {
        this.scheduleOnce(function() {
            this.PanelMask.active = false;
            wx.hideLoading();
        }, time);
    },

});
module.exports = ShareAndVideo;