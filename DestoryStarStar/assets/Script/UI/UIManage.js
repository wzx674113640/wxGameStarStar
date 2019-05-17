

var UIManage = cc.Class({

    extends: cc.Component,
    statics:
    {
        Instance:null,
    },

    onLoad()
    {
        UIManage.Instance = this;
        this.NeedStartEnvent = false;
        this.ChildrenRankCom = cc.find("wx").getComponent("ChildrenRank");
    },

    properties: {
        UIPop:cc.Node,
        UIMian:cc.Node,
        UIApp:cc.Node,
        UIList:[],
        Starting:cc.Node,
/*
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
        UIGiftBag:cc.Prefab,
        UIBtnAppList:cc.Prefab,
        UITimeGift:cc.Prefab,
        UIOtherGame:cc.Prefab,
        */
        SceneState:"",
    },
    /*
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
    */
    loderPrefabs(uiname,parentNode)
    {
        return new Promise((resolve, reject) => {
            var UINode = null;
            if (this.UIList[uiname] == undefined || this.UIList[uiname] == null) {
                var path = "Prefabs/UIPrefab/Pop/" + uiname;
                cc.loader.loadRes(path, cc.Prefab, (err, prefab) => {
                    UINode = cc.instantiate(prefab);
                    UINode.parent = parentNode;
                    this.UIList[uiname] = UINode;
                    resolve(UINode)
                });
            }
            else {
                UINode = this.UIList[uiname];
                resolve(UINode)
            }
        })
    },

    ShowGameing(action)
    {
        if(this.SceneState == "Gaming")
            return;
        this.SceneState = "Gaming";
        var self = this;
        this.loderPrefabs("Gaming",this.UIMian).then((Node)=>
        {
            self.Gameing = Node;
            self.Gameing.active = true;
            self.Starting.active = false;
            action();
        });
        
    },

    ShowGameStart()
    {
        var self = this;
        self.Starting.active  = true;
        if(self.Gameing)
        {
            self.Gameing.active = false;
        }
        self.SceneState = "Start";
        self.ChildrenRankCom.HideChild();
        self.ChildrenRankCom.ResetChildMaxScore();
        if(self.NeedStartEnvent)
        {   
            this.Starting.getComponent("UIStart").ShowSeverInfo();
            self.NeedStartEnvent = false;
        }
        
        /*
        this.loderPrefabs("UIStart",this.UIMian).then((Node)=>
        {
            self.Starting = Node;
            self.Starting.active  = true;
            if(self.Gameing)
            {
                self.Gameing.active = false;
            }
            self.SceneState = "Start";
            self.ChildrenRankCom.HideChild();
            self.ChildrenRankCom.ResetChildMaxScore();
            if(self.NeedStartEnvent)
            {   
                this.Starting.getComponent("UIStart").ShowSeverInfo();
                self.NeedStartEnvent = false;
            }
        });
        */
    },

    OpenStartUI()
    {
        if(this.Starting)
        {
            this.Starting.getComponent("UIStart").ShowSeverInfo();
        }
        else
        {
            this.NeedStartEnvent = true;
        }
    },

    ShowUIReadCache()
    {
        this.loderPrefabs("UIReadCache",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("BasePopUI").Show();
        });
      
    },

    ShowNextUI()
    {
        this.loderPrefabs("UINextLevel",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("BasePopUI").Show();
        });
    },

    ShowNextUIWonderful()
    {
        this.loderPrefabs("UIPropNextLevel",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("BasePopUI").Show();
        });
    },

    ShowGameoverUI()
    {
        this.loderPrefabs("UIGameOver",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("BasePopUI").Show();
        });
    },
    
    ShowUIDiamon(action = null)
    {
        this.loderPrefabs("UIDiamon",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("BasePopUI").Show(action);
            UINode.setSiblingIndex(UINode.parent.children.length-1);
            UINode.getComponent("BasePopUI").action = action;
        });
    },

    ShowGetBoxUI()
    {
        this.loderPrefabs("UIGetBox",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("BasePopUI").Show();
        });
    },
    ShowGetMoney()
    {
        this.loderPrefabs("UIRedBag",this.UIPop).then((UINode)=>
        {
            UINode.setSiblingIndex(UINode.parent.children.length-1);
            UINode.getComponent("UIRedBag").Show();
        });
       
    },

    ShowOpenMoney()
    {
        this.loderPrefabs("UIRedBag",this.UIPop).then((UINode)=>
        {
            UINode.setSiblingIndex(UINode.parent.children.length-1);
            UINode.getComponent("UIRedBag").ShowLook();
        });
    },

    ShowGetSkill()
    {
        this.loderPrefabs("UIGetSkill",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("BasePopUI").Show();
        });
    },

    ShowUIRanking()
    {
        this.loderPrefabs("UIRanking1",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("UIRanking").Open();
        });
    },

    ShowUICache()
    {
        this.loderPrefabs("UICache",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("UICache").Show();
        });
    },
    
    ShowUIResurt()
    {
        this.loderPrefabs("UIResurtUI",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("UIResurt").Show();
        });
    },

    ShowGiftBag()
    {
        this.loderPrefabs("UIGiftBag",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("UIGiftBag").Show();
        });
    },
    

    ShowUIHintProp(action)
    {
        this.loderPrefabs("UIHintProp",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("UIHintProp").Show(action);
        });
    },
    
    ShowAppBtn(AppIDInfoList,Applength)
    {
        this.loderPrefabs("BtnAppList",this.UIApp).then((UINode)=>
        {
            UINode.getComponent("UIBtnApp").ShowItem(AppIDInfoList,Applength)
        });
    },

    ShowUITimeGift()
    {
        this.loderPrefabs("UITimeGift",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("UITimeGift").Show();
        });
    },

    ShowOtherGamePanel()
    {
        this.loderPrefabs("UIOtherGame",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("UIOtherGame").Show();
        });
    },

    ShowUIShareFriend()
    {
        this.loderPrefabs("UIShareFriend",this.UIPop).then((UINode)=>
        {
            UINode.getComponent("UIShareFriend").Show();
        });
    }
});

