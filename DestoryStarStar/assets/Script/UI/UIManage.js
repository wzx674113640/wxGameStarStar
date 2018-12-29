

var UIManage = cc.Class({

    extends: cc.Component,
    statics:
    {
        Instance:null,
    },

    onLoad()
    {
        UIManage.Instance = this;
        
    },

    properties: {
        UIPop:cc.Node,
        UIMian:cc.Node,
        UIList:[],

        Gameing:cc.Prefab,
        UIReadCache:cc.Prefab,
        UINextLevel:cc.Prefab,
        UINextLevelWonderful:cc.Prefab,
        UIGameOver:cc.Prefab,
        UIDiamon:cc.Prefab,
        Starting:cc.Prefab,
        UIGetBox:cc.Prefab,
        UIGetSkill:cc.Prefab,
        UIRanking:cc.Prefab,
        UICache:cc.Prefab,
        UIResurt:cc.Prefab,
        
    },

    loderPrefabs(prefab,uiparent)
    {
        if(this.UIList[prefab.name] == undefined||this.UIList[prefab.nam] == null)
        {
            var UINode = cc.instantiate(prefab);
            uiparent.addChild(UINode);
            this.UIList[prefab.name] = UINode;
        }
        else
        {
            var UINode = this.UIList[prefab.name];
        }
        return UINode;
    },

    ShowGameing()
    {
        this.Gameing = this.loderPrefabs(this.Gameing,this.UIMian);
        this.Gameing.active = true;
        this.Starting.active = false;
    },

    ShowGameStart()
    {
        this.Starting = this.loderPrefabs(this.Starting,this.UIMian);
        this.Starting.active  = true;
        this.Gameing.active = false;
    },

    ShowUIReadCache()
    {
        var UINode = this.loderPrefabs(this.UIReadCache,this.UIPop);
        UINode.getComponent("BasePopUI").Show();
    },

    ShowNextUI()
    {
        var UINode = this.loderPrefabs(this.UINextLevel,this.UIPop);
        UINode.getComponent("BasePopUI").Show();
    },

    ShowNextUIWonderful()
    {
        var UINode = this.loderPrefabs(this.UINextLevelWonderful,this.UIPop);
        UINode.getComponent("BasePopUI").Show();
    },

    ShowGameoverUI()
    {
        var UINode = this.loderPrefabs(this.UIGameOver,this.UIPop);
        UINode.getComponent("BasePopUI").Show();
    },
    
    ShowUIDiamon()
    {
        var UINode = this.loderPrefabs(this.UIDiamon,this.UIPop);
        UINode.getComponent("BasePopUI").Show();
    },

    ShowGetBoxUI()
    {
        var UINode = this.loderPrefabs(this.UIGetBox,this.UIPop);
        UINode.getComponent("BasePopUI").Show();
    },
    ShowGetMoney()
    {
        
    },
    ShowGetSkill()
    {
        this.ShowNode(this.UIGetSkill);
    },

    ShowUIRanking()
    {
        var UINode = this.loderPrefabs(this.UIRanking,this.UIPop);
        UINode.getComponent("UIRanking").Open();
    },

    ShowUICache()
    {
        var UINode = this.loderPrefabs(this.UICache,this.UIPop);
        UINode.getComponent("UICache").Show();
    },
    
    ShowUIResurt()
    {
        var UINode = this.loderPrefabs(this.UIResurt,this.UIPop);
        UINode.getComponent("UIResurt").Show();
    },

    ShowNode(prefab)
    {
        var UINode = this.loderPrefabs(prefab,this.UIPop);
        UINode.getComponent("BasePopUI").Show();
    }
});

