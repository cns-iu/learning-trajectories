import { Filter, MetaFilter } from '../shared/filter';

import { levelOfEducationMappingInverse } from '../shared/person-metadata';

export interface NumericBounds {
  min: number;
  max: number
}

export class GraphQLFilter {
  user_id: string;
  includeUnused = true;

  constructor(filter?: Partial<Filter>) {
    if (filter && filter.personName) {
      this.user_id = filter.personName;
    }
    this.includeUnused = filter && filter.includeUnused;
  }
}

export class GraphQLStudentFilter {
  user_id: string;
  born: NumericBounds;
  grade: NumericBounds;
  education: string;
  course: string;

  constructor(filter: any = {}) {
    filter = filter || {};
    if (filter.personName) {
      this.user_id = filter.personName;
    }
    if(filter.age && filter.age.length > 0) {
      this.born = {
        min: Math.min(...filter.age),
        max: Math.max(...filter.age)
      };
    }
    if(filter.grade && filter.grade.length > 0) {
      this.grade = {
        min: Math.min(...filter.grade),
        max: Math.max(...filter.grade)
      };
    }
    if (filter.course) {
      this.course = filter.course;
    }
    if (filter.education) {
      this.education = levelOfEducationMappingInverse.get(filter.education) || filter.education;
    }
  }
}
