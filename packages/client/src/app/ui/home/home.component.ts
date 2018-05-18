import { 
  Component, 
  OnInit
} from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  openState = true;
  playPauseIcon = 'play_arrow';
  
  persons = [
    {value: 'person-0', viewValue: 'Person 0'},
    {value: 'person-1', viewValue: 'Person 1'},
    {value: 'person-2', viewValue: 'Person 2'}
  ];

  constructor() { }

  ngOnInit() {
  }

  onPlayToggle() {
    switch(this.playPauseIcon) {
      case 'play_arrow' :
        this.playPauseIcon = 'pause';
        break;
      case 'pause':
        this.playPauseIcon = 'play_arrow';
        break;
      default: this.playPauseIcon = 'play_arrow';
    }
  }

  onStop() {
    this.playPauseIcon = 'play_arrow';
  }

}
