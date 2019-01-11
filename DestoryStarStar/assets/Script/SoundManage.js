
var  SoundManage = cc.Class({
    extends: cc.Component,

    properties: {
        //AduioClipList:[cc.AudioClip],
        AduioClipList:{
            type:cc.AudioClip,
            default:[]
        },
        IsPlay: true,
    },
    statics:
    {
        Instance : null,
    },
    
    playDestoryStar()
    {   
        if(!this.IsPlay)
            return;
        cc.audioEngine.play(this.AduioClipList[4], false, this.volume);
    },

    playPromptSound(index)
    {
        if(!this.IsPlay)
            return;
        var aduio = this.AduioClipList[index];
        cc.audioEngine.play(aduio, false, this.volume);
    },

    playMusic()
    {
        cc.audioEngine.playMusic(this.AduioClipList[6], true);
        cc.audioEngine.setMusicVolume(0.5);
    },

    onLoad()
    {
        SoundManage.Instance = this;
        this.volume = 1;
        this.IsPlay = true;
        this.playMusic();
    },
    
    playPassSound()
    {
        if(!this.IsPlay)
            return;
        cc.audioEngine.play(this.AduioClipList[5], false, this.volume);
    },

    update()
    {

    }
});
