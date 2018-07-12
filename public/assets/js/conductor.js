var Conductor = function(props){
  this.bpm = props.bpm;
  //How long a note lasts (https://en.wikipedia.org/wiki/Quarter_note):
  this.crotchet = 60/bpm;
  this.offset = props.offset;
  this.song = props.song;
  this.noteSeries = props.notes;
  this.begin = function(){
    this.song.play();
  }
  this.update = function(){
    if(this.song.currentTime > crotchet * currentBeat)
  }
}
