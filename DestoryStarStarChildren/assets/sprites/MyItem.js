
cc.Class({
    extends: cc.Component,

    properties: {
        TxtRank:cc.Label,
        TxtScore:cc.Label
    },

   

    start () {

    },

    init: function (rank, data) {
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.TxtRank.string  = Number(rank)+1;
        this.TxtScore.string = grade.toString();
    },

    clear()
    {
        this.TxtRank.string = "";
        this.TxtScore.string = "";
    },
    
});
