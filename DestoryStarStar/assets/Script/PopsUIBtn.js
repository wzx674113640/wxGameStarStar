

cc.Class({
    extends: cc.Component,

    properties: {
       UINoHas: cc.Node,
       UIHas: cc.Node,
       LabelCount:cc.Label,
    },

    NoHas()
    {
        this.UINoHas.active = true;
        this.UIHas.active = false;
    },

    Has(count)
    {
        this.UINoHas.active = false
        this.UIHas.active = true;
        this.LabelCount.string = count;
    }

  
});
