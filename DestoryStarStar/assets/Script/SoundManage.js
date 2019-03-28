
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
        //this.LoadSever();
    },
    
    LoadSever()
    {
        let urlString = "https://xxx.qkxz.com/static/login.mp3";
        cc.loader.load(urlString,cc.AudioClip,function (err, tex) {
            cc.audioEngine.playMusic(tex);
        });
    },

    onLoad()
    {
        SoundManage.Instance = this;
        this.NodeChildren = this.node.children;
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
