
var  SoundManage = cc.Class({
    extends: cc.Component,

    properties: {
        AduioClipList:[cc.AudioClip],
        IsPlay: true,
    },
    statics:
    {
        Instance : null,
    },

    playDestoryStar()
    {   
        if(this.IsPlay == false)
            return;
        cc.audioEngine.play(this.AduioClipList[4], false, 1);
    },

    playPromptSound(index)
    {
        if(this.IsPlay == false)
            return;
        var aduio = this.AduioClipList[index];
        cc.audioEngine.play(aduio, false, 1);
    },

    onLoad()
    {
        SoundManage.Instance = this;
    },
    playPassSound()
    {
        if(this.IsPlay == false)
            return;
        cc.audioEngine.play(this.AduioClipList[5], false, 1);
    }
});
