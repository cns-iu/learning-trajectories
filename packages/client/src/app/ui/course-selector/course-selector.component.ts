import { Component, OnInit, Input } from '@angular/core';

import { Map } from 'immutable';

import { InputSelectorDataService } from '../shared/input-selector-data.service';

@Component({
  selector: 'app-course-selector',
  templateUrl: './course-selector.component.html',
  styleUrls: ['./course-selector.component.sass']
})
export class CourseSelectorComponent implements OnInit {
  courseTitleLookup: Map<string, any> = Map();

  selectedCourseId: string;
  courseIds: string[] = [];

  get selectedCourse(): string {
    return this.courseTitleLookup.get(this.selectedCourseId);
  }

  constructor(private dataService: InputSelectorDataService) {
    this.courseTitleLookup = Map(dataService.getCourseMetadata());
    this.courseIds = this.courseTitleLookup.keySeq().toArray();
    this.selectedCourseId = this.courseIds[0];
  }

  ngOnInit() {
  }
}
