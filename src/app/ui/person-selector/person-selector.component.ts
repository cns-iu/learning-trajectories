import {
  Component,
  OnInit,

  ViewEncapsulation,
  ViewChild,

  OnChanges,
  SimpleChanges,

  Input
} from '@angular/core';
import { Map } from 'immutable';
import { NouisliderComponent } from 'ng2-nouislider';

import { MetaFilter } from 'learning-trajectories-database';
import { InputSelectorDataService } from '../shared/input-selector-data.service';

const integerFormatter = {
  to(value: number): string {
    return '' + Math.round(value);
  },
  from(value: string): number {
    return Number(value);
  }
};

function displayNameSorter(a: string, b: string): number {
  const aIndex = a.lastIndexOf(' ');
  const bIndex = b.lastIndexOf(' ');
  const aValue = Number(a.slice(aIndex + 1));
  const bValue = Number(b.slice(bIndex + 1));
  return aValue - bValue;
}

@Component({
  selector: 'app-person-selector',
  templateUrl: './person-selector.component.html',
  styleUrls: ['./person-selector.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class PersonSelectorComponent implements OnInit, OnChanges {
  @Input() courseId: string;

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
    tooltips: [integerFormatter, integerFormatter],
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
    tooltips: [integerFormatter, integerFormatter],
    format: {
      to: Number,
      from: Number
    }
  };

  // person name or view value, eg. Person 1
  get selectedName(): string {
    return this.personNameToId.keyOf(this.selectedId);
  }

  constructor(private dataService: InputSelectorDataService) { }

  ngOnInit() {
    this.dataService.mapping.subscribe((map) => {
      const oldMap = this.personNameToId;
      this.personNameToId = map;
      this.persons = this.personNameToId.keySeq().toArray().sort(displayNameSorter);
      if (!this.selectedId) {
        this.selectedId = this.personNameToId.get(this.persons[1]);
      } else {
        this.personNameToId = this.personNameToId.set(oldMap.keyOf(this.selectedId), this.selectedId);
      }
    });
    this.dataService.yearRange.subscribe(([min, max]) => {
      const currentYear = (new Date()).getFullYear();
      const youngest: number = 0; // currentYear - max;
      const oldest: number = 100; // currentYear - min;
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
    this.dataService.education.subscribe((eds) => (this.educations = eds));

    this.updateSelectable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('courseId' in changes) {
      this.filter.course = this.courseId;
      this.updateSelectable();
    }
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
