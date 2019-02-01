
var ShareAndVideo = require("ShareAndVideo");

var FactoryItem = require("FactoryItem");

cc.Class({
    extends: cc.Component,

    properties: {
        Mask:cc.Node,
        NotReceive:cc.Node,
        Receive:cc.Node,
        RedUIAni:cc.Node,
        ReceiveMoney:cc.Node,
        
        LabelGetMoney : cc.Label,
        LabelMoney :cc.Label,
        LabelMoneyOther:cc.Label
    },


    Show()
    {
        if(this.TargetPos == undefined)
        {
            this.TargetPos = FactoryItem.Instance.UIMianCom.PropsDes.convertToWorldSpaceAR(cc.v2(0, 0));
        }
        //数据请求
        //this.ChildrenRankCom.C2G_GameInfo();
        //this.money = this.ChildrenRankCom.playInfo.money;
        //console.log("请求红包的次数！"+ this.count);
        if(this.ChildrenRankCom.playInfo.count<9)
        {
            this.Mask.active = true;
            if(this.isrecive)
            {
                this.ShowNotRecive();
            }
            else
            {
                //红包的UI动画
                this.Mask.active = false;
                this.ShowUIAni();
                this.RedUIAni.setScale(1);
                this.RedUIAni.setPosition(cc.v2(0,0));
                this.scheduleOnce(function(){
                    var s =  cc.scaleTo(0.5,0.1);
                    var m = cc.moveTo(0.5,cc.v2(322,430));
                    var c = cc.callFunc(function(){
                        this.RedUIAni.active = false;
                    }.bind(this));
                    this.RedUIAni.runAction(cc.sequence(cc.spawn(s,m),c));
                },0.5);
            }
        }
    },
    
    BtnReciveMoney()
    {
        wx.showModal({
            content: '福券不足！',
            success(res) {
                
            }
          })
    },

    ShowNotRecive()
    {
        this.setRecive(false);
        this.node.active = true;
        this.NotReceive.active = true;
        this.Receive.active = false;
        this.RedUIAni.active = false;
        this.ReceiveMoney.active = false;
        this.NotReceive.getComponent("NotReceive").Show();
    },

    ShowRecive()
    {
        this.node.active = true;
        this.NotReceive.active = false;
        this.Receive.active = true;
        this.RedUIAni.active = false;
        this.ReceiveMoney.active = false;
    },

    ShowUIAni()
    {
        this.node.active = true;
        this.NotReceive.active = false;
        this.Receive.active = false;
        this.RedUIAni.active = true;
        this.ReceiveMoney.active = false;
    },

    ShowUIReciveMoney()
    {
        this.ReceiveMoney.active = true;
        this.NotReceive.active = false;
        this.Receive.active = false;
        this.RedUIAni.active = false;
        this.LabelMoneyOther.string = this.ChildrenRankCom.playInfo.money;
    },

    ShowLook()
    {
        this.Mask.active = true;
        this.node.active = true;
        if(this.isrecive)
        {
            //显示提现UI
            this.ShowUIReciveMoney();
        }
        else
        {
           this.ShowNotRecive();
        }
        
    },

    setRecive(active)
    {
        this.isrecive = active;
        this.ChildrenRankCom.playInfo.isRecive = active;
    },

    onLoad () 
    {
        this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
        this.setRecive(true);
    },

    BtnClose()
    {
        this.node.active = false;
        //this.isrecive = false;
        FactoryItem.Instance.UIMianCom.setMoneyLabel();
    },
    
    BtnVideo()
    {
        if(this.ChildrenRankCom.playInfo.money == 0)
        {
            this.GetMoneyEvent();
        }
        else
        {
            ShareAndVideo.Instance.SeeVedioClick(()=>
            {
                this.GetMoneyEvent();
            });
        }   
    },

    BtnShare()
    { 
        if(this.ChildrenRankCom.playInfo.money == 0)
        {
            this.GetMoneyEvent();
        }
        else
        {
            ShareAndVideo.Instance.AddShareEvent(()=>
            {
                this.GetMoneyEvent();
            })
        }
       
    },

    GetMoneyEvent()
    {   
        var self = this;
        this.ChildrenRankCom.C2G_Redlog(()=>
        {
            self.setRecive(true);
            var playInfo = self.ChildrenRankCom.playInfo;
            self.LabelGetMoney.string = playInfo.getMoney;
            self.LabelMoney.string = playInfo.money;
            FactoryItem.Instance.UIMianCom.setMoneyLabel();
            self.ShowRecive();
        })
    }

});
