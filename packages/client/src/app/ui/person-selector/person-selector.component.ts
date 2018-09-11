import { Component, OnInit } from '@angular/core';

import { Map } from 'immutable';

import { InputSelectorDataService } from '../shared/input-selector-data.service';

@Component({
  selector: 'app-person-selector',
  templateUrl: './person-selector.component.html',
  styleUrls: ['./person-selector.component.sass']
})
export class PersonSelectorComponent implements OnInit {
  personNameToId: Map<string, string>;
  persons: string[];
  selectedId: string; // person id, eg. person1

  // person name or view value, eg. Person 1
  get selectedName(): string {
    return this.personNameToId.keyOf(this.selectedId);
  }

  constructor(private dataService: InputSelectorDataService) {
    this.personNameToId = this.dataService.personNameToId;
    this.persons = this.personNameToId.keySeq().toArray();
    this.selectedId = this.personNameToId.get(this.persons[1]);
  }

  ngOnInit() {
  }
}
