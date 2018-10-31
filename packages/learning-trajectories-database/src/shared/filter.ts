export interface Filter {
  personName: string;
  includeUnused: boolean;
}

export interface MetaFilter {
  age: [number, number];
  grade: [number, number];
  education: string;
  course: string;
}

interface NumericBounds {
  min: number;
  max: number
}


export interface GraphQLFilter {
  user_id: string;
}

export interface GraphQLStudentFilter {
  user_id: string;
  age: NumericBounds;
  grade: NumericBounds;
  education: string;
  course: string;
}

export class GraphQLFilterBuilder {
  private userId: string;

  constructor(filter?: Partial<Filter>) {
    if (filter && filter.personName) {
      this.userId = filter.personName;
    }
    
  }

  getGraphQLFilter(): GraphQLFilter {
    return { user_id : this.userId };
  }
}


export class GraphQLStudentFilterBuilder {
  private userId: string;
  private age: NumericBounds;
  private grade: NumericBounds;
  private education: string;
  private course: string;

  constructor(metaFilter?: Partial<MetaFilter>, filter?: Partial<Filter>) {
    if (filter && filter.personName) {
      this.userId = filter.personName;
    }

    if (metaFilter) {
      if(metaFilter.age && metaFilter.age.length === 2) {
        this.age.min = metaFilter.age[0];
        this.age.max = metaFilter.age[1];
      }
  
      if(metaFilter.grade && metaFilter.grade.length === 2) {
        this.grade.min = metaFilter.grade[0];
        this.grade.max = metaFilter.grade[1];
      }

      if (metaFilter.course) {
        this.course = metaFilter.course;
      }

      if (metaFilter.education) {
        this.education = metaFilter.education;
      }
    }
    
  }

  getGraphQLStudentFilter(): GraphQLStudentFilter {
    return {
      user_id: this.userId,
      age: this.age,
      grade: this.grade,
      course: this.course,
      education: this.education
    }
  }
}