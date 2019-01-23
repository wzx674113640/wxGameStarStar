var FactoryItem = require("FactoryItem");

var FlyUI =  cc.Class({
    extends: cc.Component,

    statics:
    {
        Instance : null
    },

    properties: {
        FlyScoreUIPrefabs : cc.Prefab,
        _FlyScoreUIList:[],

        RemianFlyUIPrefab: cc.Prefab,
        _RemianFlyUIList:[],

        FlyPropsUIPrefabs: cc.Prefab,
        _FlyPropsUIList:[],

        PropsUISpriteFrame: {
            type:cc.SpriteFrame,
            default:[],
        }
        //UIMian:cc.Node,
    },

    onLoad()
    {
        FlyUI.Instance = this;
    },

    start () {
        this.UIMian = null;
    },

    CreatorScoreFly(m_pos,_node,score)
    {
        var newVec2 = _node.convertToWorldSpaceAR(cc.v2(0,0));

        var FlyScore = this._FlyScoreUIList.length > 0? this._FlyScoreUIList.pop():cc.instantiate(this.FlyScoreUIPrefabs);
        
        FlyScore.setPosition(m_pos);

        FlyScore.setScale(1);

        FlyScore.parent = this.node;

        FlyScore.getComponent("FlyUIItem").setScore(score);

        FlyScore.active = true;
        
        var s = cc.scaleTo(0.5,1.2);
        
        var m = cc.moveTo(0.8,newVec2);

        var call = cc.callFunc(function()
        {
            FlyScore.active = false;

            this.UIMian.getComponent("UIMian").setLableUI(score);

            this._FlyScoreUIList.push(FlyScore);
            
        }.bind(this));

        FlyScore.runAction(cc.sequence(s,m,call));

    },
    
    PropsUIFly(index)
    {
        var PropsFly = this._FlyPropsUIList.length > 0.?this._FlyPropsUIList.pop():cc.instantiate(this.FlyPropsUIPrefabs);

        PropsFly.setPosition(cc.find("Canvas").getPosition());

        PropsFly.setScale(0.1);

        PropsFly.parent = this.node,
        
        PropsFly.getComponent(cc.Sprite).spriteFrame = this.PropsUISpriteFrame[index];

        if(index == 0)
        {
            PropsFly.getChildByName("Count").getComponent(cc.Label).string = "x5";
        }
        else
        {
            PropsFly.getChildByName("Count").getComponent(cc.Label).string = "x1";
        }

        PropsFly.active = true;

        var targetNode = null;

        var action1 = null

        var UIMianCom = this.UIMian.getComponent("UIMian");
        
        switch(index)
        {
            case 0:
                targetNode = UIMianCom.DiamondCountLabel.node;
                action1 = ()=>{
                    UIMianCom.UserDiamond(5);
                } 
                break;
            case 1:
                targetNode = UIMianCom.PropsRest;
                action1 = ()=>
                {
                    UIMianCom.UserReset(1);
                }
                break;
            case 2:
                targetNode = UIMianCom.PropsHammer;
                action1 = ()=>
                {
                    UIMianCom.UserHammerProps(1);
                }
                break;
            case 3:
                targetNode = UIMianCom.PropsChange;
                action1 = ()=>
                {
                    UIMianCom.UserChange(1);
                } 
                break;
        }
        var newVec2 = targetNode.convertToWorldSpaceAR(cc.v2(0,0));
        
        var s = cc.scaleTo(0.2,1);

        var m = cc.moveTo(0.6,newVec2);

        var call = cc.callFunc(function()
        {
            PropsFly.active = false;

            action1();

            this._FlyPropsUIList.push(PropsFly);
            
        }.bind(this));

        PropsFly.runAction(cc.sequence(s,m,call));
    },

    RemianFlyUI(sartnode,end_node,score,action)
    {
        
        var newVec1 =  sartnode.convertToWorldSpaceAR(cc.v2(0,0));

        var newVec2 = end_node.convertToWorldSpaceAR(cc.v2(0,0));

        var FlyScore = this._RemianFlyUIList.length > 0? this._RemianFlyUIList.pop():cc.instantiate(this.RemianFlyUIPrefab);
        
        FlyScore.setPosition(newVec1);
        
        FlyScore.setScale(0.1);

        FlyScore.parent = this.node;

        FlyScore.getComponent(cc.Label).string = score;

        FlyScore.active = true;

        var s = cc.scaleTo(0.2,1);

        var m = cc.moveTo(0.5,newVec2);

        var call = cc.callFunc(function()
        {
            FlyScore.active = false;

            this.UIMian.getComponent("UIMian").setLableUI(score);

            this._RemianFlyUIList.push(FlyScore);

            action();
            
        }.bind(this));

        
        if(score>0)
        {
            FlyScore.runAction(cc.sequence(s,m,call));
        }   
        else
        {
            FlyScore.active = false;
            this._RemianFlyUIList.push(FlyScore);
            action();
        }
    }
});
