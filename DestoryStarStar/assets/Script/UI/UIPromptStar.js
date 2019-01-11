
cc.Class({
    extends: cc.Component,

    properties: {
        NodeList:
        {
            type:cc.Node,
            default:[],
        },
        PassList:
        {
            type:cc.Node,
            default:[],
        },

        _PassPos:[],
    },

    onLoad()
    {
        if(this._PassPos.length == 0)
        {   
            for(var i = 0;i<this.PassList.length;i++)
            {   
                this._PassPos.push(this.PassList[i].getPosition());
            }
        }
       
    },

    PlayUI(index)
    {
        var NodeUI = this.NodeList[index];
        NodeUI.stopAllActions();
        this.HideUI();
        NodeUI.setScale(5);
        NodeUI.active = true;
        var s = cc.scaleTo(0.2,1);
        var m = cc.blink(0.8,4);
        var c = cc.callFunc(function()
        {
            NodeUI.active = false;
        }.bind(this));
        
        NodeUI.runAction(cc.sequence(s,m,c));
    },

    HideUI()
    {
        for(var i = 0;i< this.NodeList.length;i++)
        {
            this.NodeList[i].active = false;
        }
    },
    
    Pass()
    {
        for(var i = 0;i<this.PassList.length;i++)
        {
            if((i+1)%2==0)
            {
                this.PassFnotAni1(this.PassList[i],i);
            }
            else
            {
                this.PassFnotAni(this.PassList[i],i);
            }
        }
        
    },

    PassFnotAni(_node,i)
    {
        _node.active = true;
        _node.opacity = 255;
        _node.setPosition(this._PassPos[i]);
        _node.setScale(cc.v2(1,0.1));
        var s = cc.scaleTo(0.2,1,1);
       
        var s1 = cc.scaleTo(0.2,1.2);
        var s3 =  cc.scaleTo(0.2,1);
        
        var call = cc.callFunc(function()
        {
            var m = cc.moveBy(0.2,0,-50);
            var m1 =  cc.moveBy(0.3,0,300);
            var mm = cc.sequence(m,m1);
            var f = cc.fadeOut(0.5);
            var sp = cc.spawn(mm,f);
            _node.runAction(sp);
        }.bind(this));
        var ss = cc.sequence(s,s1,s3,call);
        _node.runAction(ss);
        
    },

    PassFnotAni1(_node,i)
    {
        _node.active = true;
        _node.opacity = 255;
        _node.setPosition(this._PassPos[i]);
        _node.setScale(cc.v2(1,0.1));
       
        var s = cc.scaleTo(0.2,1,1);
        var s1 = cc.scaleTo(0.2,0.8);
        var s3 =  cc.scaleTo(0.4,1.2);
        var s4 = cc.scaleTo(0.2,1);
        var call = cc.callFunc(function()
        {
            var m = cc.moveBy(0.2,0,-50);
            var m1 =  cc.moveBy(0.3,0,300);
            var mm = cc.sequence(m,m1);
            var f = cc.fadeOut(0.5);
            var sp = cc.spawn(mm,f);
            _node.runAction(sp);
        }.bind(this));
        var ss = cc.sequence(s,s1,s3,s4,call);
        _node.runAction(ss);
    },

    Close()
    {
        this.HideUI();
        for(var i = 0;i<this.PassList.length;i++)
        {
            this.PassList[i].active = false;
        }
    }
    
});
