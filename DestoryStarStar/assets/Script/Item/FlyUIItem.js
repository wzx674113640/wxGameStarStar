

cc.Class({
    extends: cc.Component,

    properties: {
      ScoreLabel : cc.Label,
      _score:0
    },

   
    setScore(score)
    {   
        this._score = score;
        this.ScoreLabel.string = score;
    }
   
    

});
