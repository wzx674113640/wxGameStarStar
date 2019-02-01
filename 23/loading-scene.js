var loadingBg = "src/99.jpg";
var loading = "src/loading.png";
var Bar1 = "src/Bar1.png";
var Bar2 = "src/Bar2.png";
var loadTile = "src/loadTile.png";
var scene = new cc.Scene();
//1.新增Canvas组件
var root = new cc.Node();
root.setScale(0.5);
var canvas = root.addComponent(cc.Canvas);

root.parent = scene;

//2.新增Sprite组件：显示loading图片
var bgSprite = root.addComponent(cc.Sprite);
var createImage = function (sprite, url) {
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    let image = wx.createImage();
    image.onload = function () {
      let texture = new cc.Texture2D();
      texture.initWithElement(image);
      texture.handleLoadedTexture();
      sprite.spriteFrame = new cc.SpriteFrame(texture);
    };
    image.src = url;
  }
}
createImage(bgSprite, loadingBg);


var load = new cc.Node();
var loadChildren = new cc.Node();
load.parent = root;
loadChildren.parent = load;

var loadSp = load.addComponent(cc.Sprite);
var loadChildrenSp = loadChildren.addComponent(cc.Sprite);
loadChildren.setAnchorPoint(0,0.5);
load.setAnchorPoint(0, 0.5);
loadChildrenSp.type = cc.Sprite.Type.TILED;
load.x -= 438/2;
loadChildren.width = 0; 
loadChildren.active = false;
createImage(loadSp,Bar1);
createImage(loadChildrenSp,Bar2);

var LabelNode = new cc.Node();
LabelNode.parent = root;
LabelNode.setPosition(cc.v2(0,100));
var Label = LabelNode.addComponent(cc.Label);


//LabelNode.color = cc.Color.YELLOW; 
LabelNode.y-=400;
load.y -= 350;
//3.预加载场景

scene.loadinglaunchScene = function (launchScene) {
  
  cc.director.preloadScene(launchScene, (completedCount, totalCount, item) => {
    loadChildren.active = true;
    var count = completedCount / totalCount;
    var value = parseInt(count * 100);
    Label.string = value + "%";
    loadChildren.width = count*438;
  }, (error) => {
    if (error) {
      console.log('==preloadScene error==', launchScene, error)
    }
    cc.director.loadScene(launchScene, null, function () {
      cc.loader.onProgress = null;
    }
    );
  })
}

module.exports = scene;