
var FileServe = require("FileServe");

var PopsInfo =  cc.Class({
    extends: cc.Component,

    properties: {
        _Diamond:0,
        Diamond:{
            get()
            {
                return this._Diamond;
            },
            set(value)
            {
                this._Diamond = value;
                FileServe.Instance.setPopsCache();
            }
        },
        _Hammer:0,
        Hammer:{
            get()
            {
                return this._Hammer;
            },
            set(value)
            {
                this._Hammer = value;
                FileServe.Instance.setPopsCache();
            }
        },
        _Change:0,
        Change:{
            get()
            {
                return this._Change;
            },
            set(value)
            {
                this._Change = value;
                FileServe.Instance.setPopsCache();
            }
        },
        _Reset:0,
        Reset:{
            get()
            {
                return this._Reset;
            },
            set(value)
            {
                this._Reset = value;
                FileServe.Instance.setPopsCache();
            }
        },
    },

    ctor:function () {
        this._Diamond = 0;
        this._Change = 0;
        this._Reset = 0;
        this._Hammer = 0;
        
    },
    setDiamond()
    {

    },

    setHammer()
    {

    },
    
    setChange()
    {

    },

    setChange()
    {

    }
   
});
module.exports = PopsInfo;
