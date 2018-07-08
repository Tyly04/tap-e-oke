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
          game.load.audio(song.key, song.path);
        });
        game.load.onLoadComplete.addOnce(selectState.prototype.run);
        game.load.start();
    });
  },
  run: function(){
    game.music = game.cache.getJSON("music");
    game.musicSelect = 0;
    game.itemSelect = game.add.sprite(game.width/2, game.height/2, game.menuKey);
    game.itemSelect.anchor.setTo(0.5);
    game.songs = game.add.group();
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
    game.music.forEach(function(item, index){
      var sprite = game.add.sprite((index * 310), game.height/2 - (game.height/3 - 20)/2, item.key);
      game.songs.add(sprite);
      var ratio = sprite.width/sprite.height;
      sprite.width = ratio * (game.height/3 - 20);
      sprite.height = game.height/3 - 20;
      sprite.title = game.add.text(0, 0, item.title, {
        fill: "#ffffff",
        fontSize: sprite.width/10,
        font: "Inconsolata",
        wordWrap: true,
        wordWrapWidth: sprite.width,
        align: 'center'
      });
      sprite.title.x = sprite.x + sprite.title.width/2;
      sprite.title.y = sprite.y -sprite.title.height/2 - 10;
      sprite.title.anchor.setTo(0.5);
      sprite.info = game.add.text(0, 0, item.info, {
        fill: "#ffffff",
        fontSize: sprite.width/12,
        font: "Inconsolata",
        wordWrap: true,
        wordWrapWidth: sprite.width,
        align: 'center'
      });
      sprite.info.x = sprite.x + sprite.info.width/2;
      sprite.info.y = sprite.y + game.itemSelect.height + 10;
      sprite.info.anchor.setTo(0.5);
      if(index === game.musicSelect){
        var sound = game.add.sound(item.key);
        sound.onDecoded.add(function(){
          var tween = game.add.tween(sound);
          sound.play('', item.start, 0);
          tween.to({volume: 1}, 1000);
          tween.start();
        });
      }
    });
  },
  update: function(){
    if(game.songs){
      game.songs.children.forEach(function(sprite, index){
        sprite.title.x = sprite.x + sprite.title.width/2;
        sprite.title.y = sprite.y -sprite.title.height/2 - 10;
        sprite.info.x = sprite.x + sprite.info.width/2;
        sprite.info.y = sprite.y + game.itemSelect.height + 10;
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
  }
  console.log(UpdateStomp.inputState);
    if(UpdateStomp.getPressedUpdate()){
      if(UpdateStomp.inputState === 2){
        game.musicSelect++;
        if(game.musicSelect >= game.songs.children.length){
          game.musicSelect = 0;
        }
        var songT = game.add.tween(game.songs);
        songT.to({x: -game.musicSelect * 310}, 2000);
        songT.start();
      } else if (UpdateStomp.inputState === 1){
        if(game.music){
          window.open('hard/' + game.music[game.musicSelect].id, "_self");
        } else {
          UpdateStomp.inputState = 0;
        }
      }
    }
  }
};
game.state.add('select', selectState);
