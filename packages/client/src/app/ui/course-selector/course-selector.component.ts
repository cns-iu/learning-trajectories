import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Map } from 'immutable';

import { InputSelectorDataService } from '../shared/input-selector-data.service';

@Component({
  selector: 'app-course-selector',
  templateUrl: './course-selector.component.html',
  styleUrls: ['./course-selector.component.sass']
})
export class CourseSelectorComponent implements OnInit, OnChanges {
  @Input() personName: string;

  courseTitleLookup: Map<string, string> = Map();

  selectedCourseId: string;
  courseIds: string[] = [];

  get selectedCourse(): string {
    return this.courseTitleLookup.get(this.selectedCourseId);
  }

  constructor(private dataService: InputSelectorDataService) {
    this.courseTitleLookup = this.courseTitleLookup.set(
      'MITProfessionalX+SysEngxB1+3T2016', 'Architecture of Complex Systems, Fall 2016'
    ); // TODO
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('personName' in changes) {
      this.dataService.getCourseIds({personName: this.personName})
        .subscribe((courseIds) => this.courseIds = courseIds);
      this.selectedCourseId = this.courseIds[0];
    }
  }

}
