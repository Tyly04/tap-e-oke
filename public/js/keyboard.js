//Thanks to jgordon510 for this code.
var PressedKeyScan = {
    addScan: function() {
        console.log("adding keyscan");
        var ignoreKeys = [37, 38, 39, 40, 9, 16, 17, 18, 32, 186, 187, 188, 189, 190, 191, 192, 219, 220, 221, 222]
        var maxTagLength = 20;
        game.input.keyboard.onDownCallback = function() {
            if (game.typing) {
                //console.log(game.input.keyboard.event.keyCode )
                if (game.input.keyboard.event.keyCode == 8) //backspace
                {
                    game.typedText = game.typedText.substring(0, game.typedText.length - 1);
                }
                else if (game.input.keyboard.event.keyCode == 13) //enter
                {
                    //game.typing = false;
                }
                else if (ignoreKeys.indexOf(game.input.keyboard.event.keyCode) > -1) {
                    //do nothing
                }
                else {
                    if (parseInt(String.fromCharCode(game.input.keyboard.event.keyCode)) > -1) {
                        game.typedText += String.fromCharCode(game.input.keyboard.event.keyCode);
                    }
                    else {
                        if (game.input.keyboard.addKey(Phaser.Keyboard.SHIFT).isDown) {
                            game.typedText += String.fromCharCode(game.input.keyboard.event.keyCode);
                        }
                        else {
                            game.typedText += String.fromCharCode(game.input.keyboard.event.keyCode + 32);
                        }
                    }

                }
            }

        };
    },
    enterDown: function() {
        return game.input.keyboard.addKey(Phaser.Keyboard.ENTER).isDown
    },
    shiftDown: function() {

        return game.input.keyboard.addKey(Phaser.Keyboard.SHIFT).isDown
    },
    backspaceDown: function() {
        return game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE).isDown
    },
    mouseHover: function(seconds, object, callback, destroyCallback){
        var mouse = game.input.activePointer;
        var object = {
            mouse: mouse,
            object: object,
            seconds: seconds,
            destroyCallback: destroyCallback
        };
        object.object.hoverOver = true;
        var interval = window.setTimeout(function(){
            callback();
        }, seconds);
        object.interval = interval;
        game.mouseUpdateGroup.push(object);
    },
    mouseUpdate: function(){
        game.mouseUpdateGroup.forEach(function(member, pos){
            if(!((member.mouse.x > member.object.x && member.mouse.x < member.object.x + member.object.width) && (member.mouse.y > member.object.y && member.mouse.y < member.object.y + member.object.height))){
                clearInterval(member.interval);
                member.object.hoverOver = false;
                game.mouseUpdateGroup.splice(pos, 1);
                member.destroyCallback();
            }
        });
    }

}
