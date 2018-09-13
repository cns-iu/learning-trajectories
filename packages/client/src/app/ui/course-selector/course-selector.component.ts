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

  courseTitleLookup: Map<string, any> = Map();

  selectedCourseId: string;
  courseIds: string[] = [];

  get selectedCourse(): string {
    return this.courseTitleLookup.get(this.selectedCourseId);
  }

  constructor(private dataService: InputSelectorDataService) {
     this.courseTitleLookup = Map(dataService.getCourseMetadata());
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('selectedCourseId' in changes || 'personName' in changes) {
      this.dataService.getCourseIds({personName: this.personName})
        .subscribe((courseIds) => this.courseIds = courseIds);
      this.selectedCourseId = this.courseIds[0];
    }
  }

}
