var UpdateStomp = {
  inputState: 0,
  prevState: 0,
  getPressedUpdate: function(){
    if(UpdateStomp.inputState === UpdateStomp.prevState){
      UpdateStomp.prevState = UpdateStomp.inputState;
      return null;
    } else {
      UpdateStomp.prevState = UpdateStomp.inputState;
      return UpdateStomp.inputState;
    }
  }
};
