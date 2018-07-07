var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');
WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, function(){
      game.state.start('menu');
    }, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Inconsolata']
    }

};
var menuState = function(){};
game.inputState = 0;
menuState.prototype = {
  preload: function(){
    var graphics = game.add.graphics();
    graphics.lineStyle(10, 0x555555, 0.2);
    graphics.beginFill(0x111111, 0.2);
    graphics.drawRect(5, 5, game.width - 10, game.height/3 - 10);
    graphics.endFill();
    graphics.lineStyle(0, 0x111111);
    game.menuKey = graphics.generateTexture();
    graphics.destroy();
  },
  create: function(){
    var title = game.add.sprite(game.width/2, game.height/2, game.menuKey);
    title.anchor.setTo(0.5);
    title.text = game.add.text(0, 0, "Tap-e-oke", {
      fill: "#ffffff",
      fontSize: (game.width/game.height)*100,
      font: "Inconsolata"
    });
    title.text.anchor.setTo(0.5);
    title.addChild(title.text);
    var t= game.add.text(game.width/2, game.height/2 + (game.height/4), "Stomp to start", {
      fill: "#ffffff",
      fontSize: (game.width/game.height) * 50,
      font: "Inconsolata"
    })
    t.anchor.setTo(0.5);
    game.cursorKeys = game.input.keyboard.createCursorKeys();
    game.cursorKeys.down.onDown.add(function(){
      UpdateStomp.inputState = 1;
    });
    game.cursorKeys.down.onUp.add(function(){
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
    if(UpdateStomp.inputState === 1){
      game.state.start('select');
    }
  }
};
game.state.add('menu', menuState);
var selectState = function(){};

selectState.prototype = {
  preload: function(){
    var i = game.load.json("music", "assets/json/songs.json");
    i.onLoadComplete.addOnce(function(){
        var music = game.cache.getJSON("music");
        music.forEach(function(song){
          game.load.image(song.key, song.art);
        });
        game.load.onLoadComplete.addOnce(selectState.prototype.run);
        game.load.start();
    });
  },
  run: function(){
    var music = game.cache.getJSON("music");
    game.musicSelect = 0;
    var itemSelect = game.add.sprite(game.width/2, game.height/2, game.menuKey);
    itemSelect.anchor.setTo(0.5);
    game.songs = game.add.group();
    music.forEach(function(item, index){
      var sprite = game.add.sprite((index * 310), game.height/2 - (game.height/3 - 20)/2, item.key);
      var ratio = sprite.width/sprite.height;
      sprite.width = ratio * (game.height/3 - 20);
      sprite.height = game.height/3 - 20;
      sprite.title = game.add.text(0, -100, item.title, {
        fill: "#ffffff",
        fontSize: sprite.width,
        font: "Inconsolata",
        wordWrap: true,
        wordWrapWidth: sprite.width * 10,
        align: 'center'
      });
      sprite.title.x = sprite.title.width/2;
      sprite.title.y = -sprite.title.height/2;
      sprite.title.anchor.setTo(0.5);
      sprite.addChild(sprite.title);
      sprite.info = game.add.text(0, sprite.height, item.info, {
        fill: "#ffffff",
        fontSize: sprite.width,
        font: "Inconsolata",
        wordWrap: true,
        wordWrapWidth: sprite.width * 10,
        align: 'center'
      });
      sprite.info.x = sprite.info.width/2;
      sprite.info.y = window.innerHeight * 3;
      sprite.info.anchor.setTo(0.5);
      sprite.addChild(sprite.info);
      game.songs.add(sprite);
    });
    selectState.prototype.updateSongSelect();
  },
  updateSongSelect: function(){
    game.songs.children.forEach(function(sprite, index){
      if(index !== game.musicSelect){
        sprite.tint = 0x111111;
        sprite.title.tint = 0x111111;
        sprite.info.tint = 0x111111;
      } else if (index === game.musicSelect){
        sprite.tint = 0xffffff;
        sprite.title.tint = 0xffffff;
        sprite.info.tint = 0xffffff;
      }
    });
  },
  update: function(){
    if(UpdateStomp.getPressedUpdate() && UpdateStomp.inputState === 2){
      game.musicSelect++;
      if(game.musicSelect >= game.songs.children.length){
        game.musicSelect = 0;
      }
      var songT = game.add.tween(game.songs);
      songT.to({x: -game.musicSelect * 310}, 2000);
      songT.start();
      selectState.prototype.updateSongSelect();
    }
  }
};
game.state.add('select', selectState);
