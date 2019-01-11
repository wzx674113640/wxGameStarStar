
var PlayInfo = cc.Class({

    properties: {
        _LastNeedScore: 0,
        _NeedScore: 0,
        _Score: 0,
        _Level: 1,
        _LastScore:0,
        _ID:0,
        _IsShowPass:false,
        _IsResurtTimes:0,
        _IsShowSkill:false,
        _is_status:false,
    },

    ctor:function () {
        this.ResetInfo();
    },

    ResetInfo()
    {
        this._LastScore = 0;
        this._LastNeedScore = 0,
        this._NeedScore = 1000,
        this._Score = 0,
        this._Level = 1;
        let timeDate = new Date();
        var showTime = timeDate.getTime();
        this._ID = showTime;

        this._IsShowPass = false;
        this._IsResurtTimes = 3;
        this._IsShowSkill = false;
    },



    NextLevel()
    {
        this._IsShowPass = false;
        this._IsShowSkill = false;
        
        this._LastScore = this._Score;
        this._LastNeedScore = this._NeedScore; 
        this._Level++;

        if(this._Level == 1)
        {
            this._NeedScore += 1000;
        }
        else if(this._Level < 3)
        {
            this._NeedScore += 1500;
        }
        else if(this._Level<6)
        {
            this._NeedScore += 2000;
        }
        else if(this._Level>=6)
        {
            var differenceScore =  2000 + 50 * (this._Level - 5);
            if(differenceScore >2500)
            {
                differenceScore = 2500;
            }
            this._NeedScore += differenceScore;
        }

    },

    ConsoleInfo()
    {
       
    }

});

module.exports = PlayInfo;