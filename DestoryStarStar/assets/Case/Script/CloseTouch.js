

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    

    onLoad () {
        cc.Node.maxTouchNum = 1;
        cc.Node.touchNum = 0;
        var dispatchEvent = cc.Node.prototype.dispatchEvent;
        cc.Node.prototype.dispatchEvent = function (event) {
        switch (event.type) {

                case 'touchstart':
                    //Print(event.type,cc.Node.touchNum,cc.Node.maxTouchNum)
                    if (cc.Node.touchNum < cc.Node.maxTouchNum) {
                        cc.Node.touchNum++;
                        cc.Node.touchNum = cc.Node.touchNum > 1 ? 1 : cc.Node.touchNum
                        this._canTouch = true;
                        dispatchEvent.call(this, event);
                    }
                    break;
                case 'touchmove':
                    //Print(event.type)
                    if (!this._canTouch && cc.Node.touchNum < cc.Node.maxTouchNum) {
                        this._canTouch = true;
                        cc.Node.touchNum++;
                        cc.Node.touchNum = cc.Node.touchNum > 1 ? 1 : cc.Node.touchNum
                    }
                    if (this._canTouch) {
                        dispatchEvent.call(this, event);
                    }

                    break;
                case 'touchend':
                    //Print(event.type)
                    if (this._canTouch) {
                        this._canTouch = false;
                        cc.Node.touchNum--;
                        cc.Node.touchNum = cc.Node.touchNum < 0 ? 0 : cc.Node.touchNum
                        dispatchEvent.call(this, event);
                    }
                    break;
                case 'touchcancel':
                    //Print(event.type)
                    if (this._canTouch) {
                        this._canTouch = true;
                        cc.Node.touchNum--;
                        cc.Node.touchNum = cc.Node.touchNum < 0 ? 0 : cc.Node.touchNum
                        dispatchEvent.call(this, event);
                    }
                    break;
                default:
                    dispatchEvent.call(this, event);
            }
        };

        var onPostActivated = cc.Node.prototype._onPostActivated;
            cc.Node.prototype._onPostActivated = function (active) {
            if(!active && this._canTouch){
                this._canTouch = false;
                cc.Node.touchNum--;
                cc.Node.touchNum = cc.Node.touchNum < 0 ? 0 : cc.Node.touchNum
            }
            onPostActivated.call(this,active);
        };

        var __onPreDestroy__ = cc.Node.prototype._onPreDestroy;
        cc.Node.prototype._onPreDestroy = function () {
            if(this._canTouch){
                this._canTouch = false;
                cc.Node.touchNum--;
                cc.Node.touchNum = cc.Node.touchNum < 0 ? 0 : cc.Node.touchNum
            }

            __onPreDestroy__.call(this);
        };

    },

    
});
