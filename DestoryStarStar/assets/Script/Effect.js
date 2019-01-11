

var Effect =  cc.Class({
    extends: cc.Component,

    properties: {
        StarEffectPrefabs : cc.Prefab,
        _StarEffectList : [],

        ShotBoomPrefabs: cc.Prefab,
        _ShotBoomEffectList : [],


        EffectStar:{
            type: cc.SpriteFrame,
            default:[],
        }
        
    },

    statics:
    {
        Instance:null,
    },

    onLoad()
    {
        Effect.Instance = this;
        this.ColorStr = ["紫色@2x.png","红色@2x.png","绿色@2x.png","蓝色@2x.png","黄色@2x.png"];
    },

    start () {

    },

    PlayStarEffect(pos,colorType)
    {
        var starEffectNode = this._StarEffectList.length == 0? cc.instantiate(this.StarEffectPrefabs):this._StarEffectList.pop();

        //var starEffectNode = cc.instantiate(this.StarEffectPrefabs);

        starEffectNode.setPosition(pos);

        starEffectNode.parent = this.node;

        starEffectNode.active = true;

        var starEffectCom =  starEffectNode.getComponent(cc.ParticleSystem);
    
        //var path = "resources/Image/Star/";
        
        //starEffectCom.texture = cc.url.raw(path+this.ColorStr[colorType]);
        
        starEffectCom.spriteFrame = this.EffectStar[colorType];

        starEffectCom.resetSystem();

        var time = starEffectCom.life;

        this.scheduleOnce(function()
        {
            this._StarEffectList.push(starEffectNode);
            starEffectNode.active = false;
        }, time);
        
    },

    playShootStarEffect(pos)
    {
        var starEffectNode = this._ShotBoomEffectList.length == 0? cc.instantiate(this.ShotBoomPrefabs):this._ShotBoomEffectList.pop();

        //var starEffectNode = cc.instantiate(this.StarEffectPrefabs);

        starEffectNode.setPosition(pos);

        starEffectNode.parent = this.node;

        starEffectNode.active = true;

        var starEffectCom =  starEffectNode.getComponent(cc.ParticleSystem);
    
        //var path = "resources/Image/Star/";
        
        //starEffectCom.texture = cc.url.raw(path+this.ColorStr[colorType]);

        starEffectCom.resetSystem();

        var time = starEffectCom.life;

        this.scheduleOnce(function()
        {
            this._ShotBoomEffectList.push(starEffectNode);
            starEffectNode.active = false;
        }, time);
    }
});
