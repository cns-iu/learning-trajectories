import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-animation-controls',
  templateUrl: './animation-controls.component.html',
  styleUrls: ['./animation-controls.component.sass']
})
export class AnimationControlsComponent implements OnInit {
  playPauseIcon = 'play_arrow';
  selectedControl = 'stop';

  constructor() { }

  ngOnInit() {
  }
  
  onPlayToggle() {
    switch(this.playPauseIcon) {
      case 'play_arrow' :
        this.selectedControl = 'play';
        this.playPauseIcon = 'pause';
        break;
      case 'pause':
        this.selectedControl = 'pause';
        this.playPauseIcon = 'play_arrow';
        break;
      default: 
        this.selectedControl = 'stop';
        this.playPauseIcon = 'play_arrow';
    }
  }

  onStop() {
    this.selectedControl = 'stop';
    this.playPauseIcon = 'play_arrow';
  }

}
