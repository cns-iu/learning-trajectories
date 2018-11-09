import { Component, OnInit, Input } from '@angular/core';

import { Map } from 'immutable';

import { InputSelectorDataService } from '../shared/input-selector-data.service';

@Component({
  selector: 'app-course-selector',
  templateUrl: './course-selector.component.html',
  styleUrls: ['./course-selector.component.sass']
})
export class CourseSelectorComponent implements OnInit {
  courseTitleLookup: Map<string, any>;
  selectedCourseId: string;
  courseIds: string[];

  get selectedCourse(): string {
    return this.courseTitleLookup ? this.courseTitleLookup.get(this.selectedCourseId) : null;
  }

  constructor(private dataService: InputSelectorDataService) { }

  ngOnInit() {
    this.dataService.getCourseMetadata().subscribe((courses) => {
      this.courseTitleLookup = Map(courses);
      this.courseIds = this.courseTitleLookup.keySeq().toArray();
      this.selectedCourseId = this.courseIds[0];
    });
  }
}
