

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
        }
        
    },
    AddShareEvent(action)
    {
        var value = Math.floor(Math.random()*4);
        if(value==0)
        {
            var ShareString = "小学生又出“神造句”,语文老师笑了,家长被气哭!";
            //var ShareImg = "src/share0.jpg";
            var ShareImg = "https://graph.baidu.com/resource/112d08be6b1a7de0d774601546858513.jpg";
        }
        else if(value == 1)
        {
            var ShareString = "据说这个游戏能玩到1个亿，你能达到这个小目标吗";
            //var ShareImg = "src/share1.jpg"
            var ShareImg = "https://graph.baidu.com/resource/1bc836d39b531256d31dc01546858489.jpg";
        }
        else if(value == 2)
        {
            var ShareString = "2018春节请假攻略,最长可休16天！";
            //var ShareImg = "src/share2.jpg"
            var ShareImg = "https://graph.baidu.com/resource/15572e698f3e043f7f9be01546858430.jpg";
        }
        else if(value == 3)
        {
            var ShareString = "2018年平均工资出炉,这次您又被平均了吗?";
            //var ShareImg = "src/share3.jpg"
            var ShareImg = "https://graph.baidu.com/resource/10e22ce69808d71d0525201546858474.jpg";
        }
        wx.shareAppMessage({
            title: ShareString,
            imageUrl: ShareImg,
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
                
            //bannerAd.show().then(() => console.log('banner 广告显示'));
            
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
    },

    //看视频
    SeeVedioClick(action,str=null,failAction)
    {
        this.ShowPanelMask();
        if(!CC_WECHATGAME)
            return;
        this.videoAd = wx.createRewardedVideoAd({
            adUnitId: 'adunit-649c1f174c1ce79c'
        });
       
        this.videoAd.load().then(() => 
        {
            this.HidePanelMask(1);
            this.isStop = true;
            this.videoAd.show()
        });
        this.videoAd.onError(err => {
            this.HidePanelMask(1);
        })
        this.videoAd.onClose(res => {
            this.videoAd.offClose();
            if (this.isStop&& res && res.isEnded || res === undefined) {
                this.isStop = false;
                if(str != null)
                {
                    wx.showToast({
                        title: str,
                        icon: 'success',
                        duration: 800
                    })
                }
                action();
            } 
            else {
                this.isStop = false;
                wx.showToast({
                    title: '没有看完视频',
                    icon: 'success',
                    duration: 800
                })
                failAction();
            }
            this.HidePanelMask(1);
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