import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-person-selector',
  templateUrl: './person-selector.component.html',
  styleUrls: ['./person-selector.component.sass']
})
export class PersonSelectorComponent implements OnInit {
    persons = [
    {value: 'person-0', viewValue: 'Person 0'},
    {value: 'person-1', viewValue: 'Person 1'},
    {value: 'person-2', viewValue: 'Person 2'}
  ];
  
  constructor() { }

  ngOnInit() {
  }

}
