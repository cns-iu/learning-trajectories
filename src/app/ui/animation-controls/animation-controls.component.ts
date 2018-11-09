import { Component, Input, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-animation-controls',
  templateUrl: './animation-controls.component.html',
  styleUrls: ['./animation-controls.component.sass']
})
export class AnimationControlsComponent implements OnInit {
  playPauseIcon = 'play_arrow';
  @Output() selectedControl = new Subject<string>();

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  onPlayToggle() {
    switch (this.playPauseIcon) {
      case 'play_arrow' :
        this.selectedControl.next('play');
        this.playPauseIcon = 'pause';
        break;

      case 'pause':
        this.selectedControl.next('pause');
        this.playPauseIcon = 'play_arrow';
        break;

      default:
        this.selectedControl.next('play');
        this.playPauseIcon = 'play_arrow';
        break;
    }
  }

  onStop() {
    this.selectedControl.next('stop');
    this.playPauseIcon = 'play_arrow';
    this.changeDetector.detectChanges();
  }

  onStepToggle(direction: 'forward' | 'backward'): void {
    this.selectedControl.next(direction);
  }
}
