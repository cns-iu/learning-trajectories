import { CourseModule, Transition } from '../shared/trajectory';
import { PersonMetaData } from '../shared/person-metadata';

export const getCourseModulesQuery = `
  query getCourseModules($filter: Filter) {
      courseModules(filter: $filter) {
        module_id
        course_id
        category
        name
        chapter_id
        sequential_id
        vertical_id
        level
        index
        first_leaf_index
      }
    }
`;

// TODO: Map raw data into CourseModules
export function asCourseModule(data: any): CourseModule {
  return <CourseModule>data;
}

export const getTransitionsQuery = `
  query getTransitions($filter: Filter) {
    transitions(filter: $filter) {
      user_id
      course_id
      index
      module_id
      next_module_id
      next_index
      direction
      distance
      event_type
      duration
      time
    }
  }
`;

// TODO: Map raw data into Transitions
export function asTransition(data: any): Transition {
  return <Transition>data;
}

export const getCoursesQuery = `
  query getCourses($filter: Filter) {
    courses(filter: $filter) {
      course_id
      course_title
    }
  }
`;

export const getStudentIdsQuery = `
  query getStudents($filter: StudentFilter) {
    students(filter: $filter) {
      user_id
    }
  }
`;

export const getStudentsQuery = `
  query getStudents($filter: StudentFilter) {
    students(filter: $filter) {
      user_id
      course_id
      grade
      gender
      LoE
      YoB
    }
  }
`;

// TODO: Map raw data into PersonMetadata
export function asPersonMetaData(data: any): PersonMetaData {
  return <PersonMetaData>data;
}
