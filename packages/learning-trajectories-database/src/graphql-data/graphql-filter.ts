import { Filter, MetaFilter } from '../shared/filter';

export interface NumericBounds {
  min: number;
  max: number
}

export class GraphQLFilter {
  user_id: string;

  constructor(filter?: Partial<Filter>) {
    if (filter && filter.personName) {
      this.user_id = filter.personName;
    }
  }
}

export class GraphQLStudentFilter {
  user_id: string;
  age: NumericBounds;
  grade: NumericBounds;
  education: string;
  course: string;

  constructor(filter: any = {}) {
    filter = filter || {};
    if (filter.personName) {
      this.user_id = filter.personName;
    }
    if(filter.age && filter.age.length > 0) {
      this.age = {
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
      this.education = filter.education;
    }
  }
}
