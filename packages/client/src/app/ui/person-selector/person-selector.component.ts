import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Map } from 'immutable';
import { NouisliderComponent } from 'ng2-nouislider';

import { PersonSelectorDataService } from '../shared/person-selector-data.service';
import { MetaFilter } from 'learning-trajectories-database';

@Component({
  selector: 'app-person-selector',
  templateUrl: './person-selector.component.html',
  styleUrls: ['./person-selector.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class PersonSelectorComponent implements OnInit {
  personNameToId: Map<string, string> = Map();
  persons: string[] = [];
  selectedId: string; // person id, eg. person1
  educations: string[] = [];
  private filter: Partial<MetaFilter> = {};
  private yearRange: [number, number];
  private yearOffset: number;

  @ViewChild('ageSlider') ageSlider: NouisliderComponent;
  @ViewChild('gradeSlider') gradeSlider: NouisliderComponent;

  ageSliderConfig = {
    start: [0, 100],
    margin: 0,
    padding: [0, 0],
    step: 1,
    range: {
      min: [10],
      max: [99]
    },
    connect: [false, true, false],
    tooltips: [true, true],
    format: {
      to: Number,
      from: Number
    }
  };
  gradeSliderConfig = {
    start: [0, 100],
    margin: 0,
    padding: [0, 0],
    step: 1,
    range: {
      min: [0],
      max: [100]
    },
    connect: [false, true, false],
    tooltips: [true, true],
    format: {
      to: Number,
      from: Number
    }
  };

  // person name or view value, eg. Person 1
  get selectedName(): string {
    return this.personNameToId.keyOf(this.selectedId);
  }

  constructor(private dataService: PersonSelectorDataService) {
    dataService.mapping.subscribe((map) => {
      const oldMap = this.personNameToId;
      this.personNameToId = map;
      this.persons = this.personNameToId.keySeq().toArray();
      if (!this.selectedId) {
        this.selectedId = this.personNameToId.get(this.persons[1]);
      } else {
        this.personNameToId = this.personNameToId.set(oldMap.keyOf(this.selectedId), this.selectedId);
      }
    });
    dataService.yearRange.subscribe(([min, max]) => {
      const currentYear = (new Date()).getFullYear();
      const youngest = currentYear - max;
      const oldest = currentYear - min;
      const offset = youngest === oldest ? 1 : 0;
      const config = { start: [youngest, oldest], range: { min: youngest, max: oldest + offset } };
      this.yearRange = [min, max];
      this.yearOffset = currentYear;

      if (this.ageSlider) {
        setTimeout(() => this.ageSlider.slider.updateOptions(config), 0);
      } else {
        Object.assign(this.ageSliderConfig, config);
      }
    });
    dataService.education.subscribe((eds) => (this.educations = eds));

    this.updateSelectable();
  }

  ngOnInit() {
  }

  onAgeChange([min, max]: [number, number]): void {
    if ((max - min) === (this.yearRange[1] - this.yearRange[0])) {
      delete this.filter.age;
    } else {
      this.filter.age = [this.yearOffset - max, this.yearOffset - min];
    }
    this.updateSelectable();
  }

  onGradeChange([min, max]: [number, number]): void {
    if (min === 0 && max === 100) {
      delete this.filter.grade;
    } else {
      this.filter.grade = [min, max];
    }
    this.updateSelectable();
  }

  onEducationChange({ value }: { value: string }): void {
    if (!value) {
      delete this.filter.education;
    } else {
      this.filter.education = value;
    }
    this.updateSelectable();
  }

  private updateSelectable(): void {
    this.dataService.update(this.filter);
  }
}
