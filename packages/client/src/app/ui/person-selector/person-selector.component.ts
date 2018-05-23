import { Component, OnInit } from '@angular/core';

import { selector } from '../shared/selector';

import { PersonSelectorDataService } from '../shared/person-selector-data.service';

@Component({
  selector: 'app-person-selector',
  templateUrl: './person-selector.component.html',
  styleUrls: ['./person-selector.component.sass']
})
export class PersonSelectorComponent implements OnInit {
  persons: selector<string>[];
  selected: string;

  constructor(private dataService: PersonSelectorDataService) { 
    this.persons = this.dataService.persons;
    this.selected = this.persons[1].value;
  }

  ngOnInit() {
  }

}
