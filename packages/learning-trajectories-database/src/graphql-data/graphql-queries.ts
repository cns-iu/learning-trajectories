import { List, Map } from 'immutable';

import { CourseModule, Transition } from '../shared/trajectory';
import { PersonMetaData, genderMapping, levelOfEducationMapping } from '../shared/person-metadata';


export const getCourseModulesQuery = `
  query getCourseModules($filter: Filter) {
      courseModules(filter: $filter) {
        module_id
        course_id
        category
        name
        chapter_id
        chapter_name
        sequential_id
        sequential_name
        vertical_id
        level
        index
        first_leaf_index
        events
        duration
      }
    }
`;

export function asCourseModule(data: any): CourseModule {
  return <CourseModule>{
    id: data.module_id,
    courseId: data.course_id,
    moduleType: data.category,
    description: data.name,

    level2Id: data.sequential_id,
    level2Label: data.sequential_name || data.name || '',
    level1Id: data.chapter_id,
    level1Label: data.chapter_name || '',

    order: data.first_leaf_index,

    // TODO: Verify if below used, before creating queries
    uniqueStudents: 0,
    sessions: 0,
    days: 0,
    events: data.events || 0,
    totalTime: data.duration || 0,
    forwardIndegree: 0,
    backwardIndegree: 0,
    forwardOutdegree: 0,
    backwardOutdegree: 0,
    selfLoopCount: 0,
  };
}

export const getTransitionsQuery = `
  query getTransitions($filter: Filter) {
    transitions(filter: $filter) {
      user_id
      course_id
      index
      first_leaf_index
      module_id
      module_label
      next_module_id
      next_module_label
      next_index
      next_first_leaf_index
      direction
      distance
      event_type
      duration
      time
    }
  }
`;

export function asTransition(data: any): Transition {
  return <Transition>{
    source: data.module_id,
    target: data.next_module_id,

    sourceModule: {id: data.module_id, level2Label: data.module_label}, // TODO
    targetModule: {id: data.next_module_id, level2Label: data.next_module_label}, // TODO

    sourceOrder: data.first_leaf_index,
    sourceSessionId: '', // TODO: Unused?
    sourceTemporalSessionId: 0, // TODO: Unused?

    targetOrder: data.next_first_leaf_index,
    targetSessionId: '', // TODO: Unused?
    targetTemporalSessionId: 0, // TODO: Unused?

    direction: data.direction,
    distance: data.distance,
    timestamp: data.time,
    userId: data.user_id,

    selfLoopFlag: data.direction === 'sl',

    count: 10, // TODO: Unused?
  };
}

export function postProcessTransitions(edges: Transition[]): Transition[] {
  const overlapMap = Map<any, Transition[]>().withMutations((map) => {
    edges.forEach((edge) => {
      const key = List.of(edge.source, edge.target);
      let list = map.get(key);
      if (list === undefined) {
        list = [];
        map.set(key, list);
      }
      list.push(edge);
    });
  });

  overlapMap.forEach((list) => {
    const length = list.length;
    list.forEach((edge) => {
      edge.count = length;
    });
  });

  return edges;
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

export function asPersonMetaData(data: any): PersonMetaData {
  return <PersonMetaData>{
    grade: (data.grade * 100).toString() + '%',
    gender: genderMapping.get(data.gender) || data.gender || '',
    levelOfEducation: levelOfEducationMapping.get(data.LoE) || data.LoE || '',
    born: data.YoB || ''
  };
}
