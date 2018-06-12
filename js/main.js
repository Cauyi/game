 var game = new Phaser.Game(210, 400, Phaser.CANVAS, 'game');
    game.States = {};
    var rotationSpeed = 3;
  //预加载动画
  game.States.boot = function() {
  this.preload = function() {
    if(typeof(GAME) !== "undefined") {
      this.load.baseURL = GAME + "/";
    }
    if(!game.device.desktop){
      this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
      this.scale.forcePortrait = true;
      this.scale.refresh();
    }
    game.load.image('loading', 'assets/preloader.gif');
  };
  this.create = function() {
    game.state.start('preload');
  };
};
//预加载
game.States.preload = function() {
  this.preload = function() {
    var preloadSprite = game.add.sprite(10, game.height/2, 'loading');
    game.load.spritesheet('startbutton', 'assets/startbutton.png', 100, 40, 2);
    game.load.image('target', '../assets/target.png');
    game.load.image('knife', '../assets/knife.png');
    game.load.image('background', '../assets/bg.jpg');
  };
  this.create = function() {
    game.state.start('main');
  };

  //游戏开始界面
  game.States.main = function() {
  this.create = function() {
    // 背景
    var bg = game.add.tileSprite(0, 0, game.width, game.height, 'background');
  
    this.startbutton = game.add.button(70, 200, 'startbutton', this.onStartClick, this, 1, 1, 0);
     var style = { font: "15px Arial", fill: "#ff0044", align: "center" };
    var text = game.add.text(game.world.centerX-30, game.world.centerY-20, "knife-hit", style);
 
  };
  this.onStartClick = function() {
    game.state.start('leverl1');
  };
};
};

game.States.leverl1 = function() {
  this.create=function(){
     this.canThrow = true;
     this.knifeGroup = this.add.group();
     // game.stage.backgroundColor = 0xfffff;
     this.target = this.game.add.sprite(game.width/2, game.height/4, "target");
     this.target.anchor.set(0.5);
     this.target.scale.set(0.3); 
     this.add.tween(this.target).to({ angle: 360 }, 2500, Phaser.Easing.Linear.None, true, 0, -1);
     this.knife = this.game.add.sprite(90,game.height-100,'knife');
     // console.log(this.target.width);
     this.knife.scale.set(0.3);
     // this.input.on("pointerdown", this.throwKnife, this);
     this.input.onDown.add(this.throwKnife, this);
  }
  this.throwKnife = function(){
    // 判断是否可以投掷  
    if (this.canThrow) {  
      // 投掷后一段时间不可再次投掷  
      this.canThrow = false;  
      this.game.add.tween(this.knife).to(  
        { y: this.target.y + this.target.width / 4 },  
        3,  
        Phaser.Easing.Sinusoidal.InOut,  
        true)  
        .onComplete.add(this.knifeTween, this);  
    }  
  }
  this.knifeTween=function() {  
    // 判断飞刀是否可以插入圆木  
    let legalHit = true;  
    // 获取在圆木上旋转的飞刀数组  
    const children = this.knifeGroup.children;  
    // 遍历飞刀数组  
    for (let i = 0; i < children.length; i++) {  
      // 判断刀间夹角是否满足条件  
      if (Math.abs(Phaser.Math.getShortestAngle(  
        this.target.angle,  
        children[i].impactAngle)) < gameOptions.minAngle) {  
        // 不满足条件  
        legalHit = false;  
        break;  
      }  
    }  
    // 判断是否满足条件  
    if (legalHit) {  
      // 可以继续投掷  
      this.canThrow = true;  
      // 飞刀数组中增加本次飞刀  
      const knife = this.add.sprite(this.knife.x, this.knife.y, "knife");  
      // 存储目标角度  
      knife.impactAngle = this.target.angle;  
      // 添加到数组  
      this.knifeGroup.add(knife);  
      // 新生成一把刀  
      this.knife.y = this.game.config.height / 5 * 4;  
    }  
    else {  
      // 掉下来的动画  
      this.game.add.tween(this.knife).to(  
        {   
          y: this.game.config.height + this.knife.height,  
          rotation: 4  
        },  
        gameOptions.throwSpeed * 6,  
        Phaser.Easing.Sinusoidal.InOut,  
        true)  
        .onComplete.add(this.newGame, this);  
    }  
  }  
  
}

game.state.add('boot', game.States.boot);
game.state.add('preload', game.States.preload);
game.state.add('main', game.States.main);
game.state.add('leverl1', game.States.leverl1);
game.state.add('over', game.States.over);

game.state.start('boot');