function Drawer(canvas, app) {
  this.canvas = canvas;
  this.ctx = this.canvas.getContext('2d');
  this.heightPerNote = null;
  this.numNotesInExtent = null;
  this.app = app;
  this.keyColors = ["w", "b", "w", "b", "w", "b", "w", "w", "b", "w", "b", "w"];
  this.noteColors = ["#A8579A", "#67BA23", "#CC7E4B", "#7F7DD8"];
  this.noteScaleFactor = 110;
  this.noteScale = this.noteScaleFactor;  // computed
  this.pianoKeyWidth = 25;
  this.mappedAppTime = 0;  // computed
  this.channelDrawStartIndexes = {};
}

Drawer.prototype.draw = function draw(time) {
  this.canvas.width = this.canvas.width;  // Reset the canvas
  this.noteScale = this.noteScaleFactor * this.app.originalTempo / this.app.currentTempo;
  this.mappedAppTime = (time - Tone.context.lookAhead) * (this.app.currentTempo / this.app.originalTempo);
  this.ctx.save();
  this.ctx.globalAlpha = 0.7;

  this.numNotesInExtent = this.app.noteNumberExtent[1] - this.app.noteNumberExtent[0] + 1;
  this.heightPerNote = this.canvas.height / this.numNotesInExtent;

  this.drawNoteGrid();

  for (let [channelIndex, channel] of this.app.channels.entries()) {
    if (channel.isActive) {
      this.ctx.save();
      this.ctx.fillStyle = this.noteColors[channel.track.channelNumber];
      this.ctx.lineWidth = 1;

      // update note start index (i.e. at what index we start drawing notes for this channel)
      // this helps avoid drawing many notes that are outside the canvas
      if (!this.channelDrawStartIndexes[channelIndex]) {
        this.channelDrawStartIndexes[channelIndex] = 0;
      }
      for (let i = this.channelDrawStartIndexes[channelIndex]; i >= 0; i--) {
        const note = channel.track.notes[i];
        if (!note) {
          break;
        }
        const noteRectDimensions = this.getNoteRectDimensions(note);
        if ((noteRectDimensions.x + noteRectDimensions.width) < -3) {
          if (this.channelDrawStartIndexes[channelIndex] < channel.track.notes.length - 2) {
            this.channelDrawStartIndexes[channelIndex]++;
          }
          break;
        } else {
          this.channelDrawStartIndexes[channelIndex] = i;
        }
      }

      const startDrawIndex = Math.max(this.channelDrawStartIndexes[channelIndex] - 1, 0);
      for (let i = startDrawIndex; i < channel.track.notes.length; i++) {
        const note = channel.track.notes[i];
        const isWithinBounds = this.drawNote(note);
        if (!isWithinBounds) {
          // No need to keep drawing if the rest of the notes are out of bounds
          break;
        }
      }
      this.ctx.restore();
    }
  }
  this.ctx.restore();
};

Drawer.prototype.drawNoteGrid = function () {
  for (let noteNumber = this.app.noteNumberExtent[0]; noteNumber <= this.app.noteNumberExtent[1]; noteNumber++) {
    let y = this.getYByNoteNumber(noteNumber);

    // Draw piano key
    let colorIndex = noteNumber % 12;
    if (this.keyColors[colorIndex] === "w") {
      this.ctx.fillStyle = "#fafafa";
    } else {
      this.ctx.fillStyle = "#222";
    }
    this.ctx.fillRect(0, y, this.pianoKeyWidth, this.heightPerNote);

    // Draw horizontal grid line
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(0, y - 1, this.canvas.width, 2);
    this.ctx.restore();
  }

  // Draw line to separate piano tangent from note grid
  this.ctx.fillStyle = "#222";
  this.ctx.fillRect(this.pianoKeyWidth, 0, 3, this.canvas.height);
};

Drawer.prototype.getNoteRectDimensions = function (note) {
  return {
    x: 3 + this.pianoKeyWidth + (note.time - this.mappedAppTime) * this.noteScale,
    y: this.getYByNoteNumber(note.midi),
    width: note.duration * this.noteScale,
    height: this.heightPerNote,
  };
};

Drawer.prototype.drawNote = function (note) {
  const noteRectDimensions = this.getNoteRectDimensions(note);
  this.ctx.fillRect(noteRectDimensions.x, noteRectDimensions.y, noteRectDimensions.width, noteRectDimensions.height);
  this.ctx.strokeRect(noteRectDimensions.x, noteRectDimensions.y, noteRectDimensions.width, noteRectDimensions.height);

  return noteRectDimensions.x < this.canvas.width;  // false if out of bounds
};

Drawer.prototype.getYByNoteNumber = function(noteNumber) {
  const relativeNoteNumber = noteNumber - this.app.noteNumberExtent[0];
  return this.canvas.height - this.heightPerNote * relativeNoteNumber - this.heightPerNote;
};
