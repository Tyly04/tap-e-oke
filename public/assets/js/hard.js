var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game', null, false,  false);
var params = {};
var song = function(){};
song.prototype = {
  preload: function(){
    game.stage.disableVisibilityChange = true;
    game.load.image('arrow', '../assets/images/arrow.png');
    var i = game.load.json("music", "../assets/json/songs.json");
    i.onLoadComplete.addOnce(function(){
        game.music = game.cache.getJSON("music");
        game.music.forEach(function(song){
          if(song.id === params.id){
            game.cSong = song;
            game.load.audio('song', song.path);
          }
        });
        game.load.onLoadComplete.addOnce(song.prototype.run);
        game.load.start();
    });
    game.load.start();
  },
  run: function(){
    var song = game.add.sound('song');
    var t = game.add.text(game.width/2, game.height/2, "Ready?", {
      font: "Arial",
      fill: "#ffffff",
      fontSize: game.width/10
    });
    t.anchor.setTo(0.5);
    var tween = game.add.tween(t);
    tween.to({alpha: 0}, 1000);
    game.arrows = game.add.group();
    game.arrows.position.setTo(game.width/10, game.height/6);
    game.arrows.scale.setTo(game.width/1000);
    var rotArr = [90, 0, 180, -90];
    for(var i = 0; i < 4; i++){
      var arrow = game.add.sprite(i * 50, 0, 'arrow');
      arrow.anchor.setTo(0.5);
      arrow.tint = 0xaaaaaa;
      arrow.angle = rotArr[i];
      game.arrows.add(arrow);
    }
    game.arrows.alpha = 0;
    game.movingArrows = game.add.group();
    game.movingArrows.scale.setTo(game.width/1000);
    var otherTween = game.add.tween(game.arrows);
    otherTween.to({alpha: 1}, 1000);
    window.setTimeout(function(){
      otherTween.start();
      tween.start();
      song.play();
      song.onDecoded.add(function(){
        song.fadeIn();
      });
      var cIndex = 0;
      var tintArr = [0xff00dd, 0x55ddaa, 0xaa00aa, 0x00ddaa];
      var int = setInterval(function(){
        if(cIndex < game.cSong.fourLane[0].length){
        game.cSong.fourLane.forEach(function(lane, index){
          if(lane[cIndex + 1] === 1){
            var arrow = game.add.sprite((game.width/10) - (game.arrows.children[0].width) + index * 50, game.height, 'arrow');
            arrow.tint = tintArr[index];
            arrow.anchor.setTo(0.5);
            arrow.angle = rotArr[index];
            arrow.tween = game.add.tween(arrow);
            arrow.tween.to({y: -game.height - game.arrows.y - arrow.height}, 5000);
            arrow.tween.start();
            game.movingArrows.add(arrow);
          }
        });
        cIndex += 1;
      } else {
        clearInterval(int);
      }
    }, 50);
    }, 1000);
  },
  create: function(){
    game.cursorKeys = game.input.keyboard.createCursorKeys();
    game.space = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    game.space.onDown.add(function(){
      UpdateStomp.inputState = 1;
    });
    game.space.onUp.add(function(){
      UpdateStomp.inputState = 0;
    });
    game.cursorKeys.up.onDown.add(function(){
      UpdateStomp.inputState = 5;
    });
    game.cursorKeys.up.onUp.add(function(){
      UpdateStomp.inputState = 0;
    });
    game.cursorKeys.down.onDown.add(function(){
      UpdateStomp.inputState = 3;
    });
    game.cursorKeys.down.onUp.add(function(){
      UpdateStomp.inputState = 0;
    });
    game.cursorKeys.right.onDown.add(function(){
      UpdateStomp.inputState = 4;
    });
    game.cursorKeys.right.onUp.add(function(){
      UpdateStomp.inputState = 0;
    });
    game.cursorKeys.left.onDown.add(function(){
      UpdateStomp.inputState = 2;
    });
    game.cursorKeys.left.onUp.add(function(){
      UpdateStomp.inputState = 0;
    });
  },
  update: function(){
    switch(UpdateStomp.inputState){
      case 1:
        game.arrows.children.forEach(function(child){
          child.tint = 0xaaaaaa;
        });
      break;
      case 2:
        game.arrows.children[0].tint = 0xffffff;
        game.arrows.children[3].tint = 0xaaaaaa;
      break;
      case 3:
        game.arrows.children[1].tint = 0xffffff;
        game.arrows.children[2].tint = 0xaaaaaa;
      break;
      case 4:
        game.arrows.children[3].tint = 0xffffff;
        game.arrows.children[0].tint = 0xaaaaaa;
      break;
      case 5:
      game.arrows.children[2].tint = 0xffffff;
      game.arrows.children[1].tint = 0xaaaaaa;
      break;
    }
  }
};
game.state.add('song', song);
socket.on('params', function (data) {
  params = data.params;
  game.state.start('song');
});
