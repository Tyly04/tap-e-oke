var Conductor = function(props){
  this.bpm = props.bpm;
  //How long a note lasts:
  this.crotchet = 60/bpm;
  this.offset = props.offset;
  this.song = props.song;
  this.update = function(){
    if(this.song.currentTime > crotchet * currentBeat)
  }
}
