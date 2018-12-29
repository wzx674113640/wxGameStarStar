

var ShareAndVideo =  cc.Class({
    extends: cc.Component,

    statics:
    {
        Instance : null,
    },

    properties: {
        
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
        var value = Math.floor(Math.random()*2);
        if(value==0)
        {
            var ShareString = "小学生又出“神造句”,语文老师笑了,家长被气哭!";
            var ShareImg = "src/share0.png";
        }
        else
        {
            var ShareString = "据说这个游戏能玩到1个亿，你能达到这个小目标吗";
            var ShareImg = "src/share1.png"
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
                        title: "分享成功!",
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
                    wx.showToast({
                        title: "分享失败！",
                        icon: 'Fail',
                        duration: 800
                      })
                    this.ShareEvent = null;
                }
            }
        })
    },

    
});
module.exports = ShareAndVideo;