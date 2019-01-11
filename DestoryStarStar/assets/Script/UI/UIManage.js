

var UIManage = cc.Class({

    extends: cc.Component,
    statics:
    {
        Instance:null,
    },

    onLoad()
    {
        UIManage.Instance = this;
        this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
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
        UIRedMoney:cc.Prefab,

        SceneState:"",
    },

    loderPrefabs(prefab,uiparent)
    {
        if(this.UIList[prefab.name] == undefined||this.UIList[prefab.name] == null)
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
        this.SceneState = "Gaming";
    },

    ShowGameStart()
    {
        this.Starting = this.loderPrefabs(this.Starting,this.UIMian);
        this.Starting.active  = true;
        this.Gameing.active = false;
        this.SceneState = "Start";
        this.ChildrenRankCom.HideChild();
        this.ChildrenRankCom.ResetChildMaxScore();
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
    
    ShowUIDiamon(action = null)
    {
        var UINode = this.loderPrefabs(this.UIDiamon,this.UIPop);
        UINode.getComponent("BasePopUI").Show(action);
        UINode.setSiblingIndex(UINode.parent.children.length-1);
        UINode.getComponent("BasePopUI").action = action;
    },

    ShowGetBoxUI()
    {
        var UINode = this.loderPrefabs(this.UIGetBox,this.UIPop);
        UINode.getComponent("BasePopUI").Show();
    },
    ShowGetMoney()
    {
        var UINode = this.loderPrefabs(this.UIRedMoney,this.UIPop);
        UINode.setSiblingIndex(UINode.parent.children.length-1);
        UINode.getComponent("UIRedBag").Show();
    },

    ShowOpenMoney()
    {
        var UINode = this.loderPrefabs(this.UIRedMoney,this.UIPop);
        UINode.setSiblingIndex(UINode.parent.children.length-1);
        UINode.getComponent("UIRedBag").ShowLook();
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

