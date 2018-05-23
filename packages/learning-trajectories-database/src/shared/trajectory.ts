export interface CourseModule {
  id: string; // module uuid
  courseId: string; // course name identifier
  moduleType: string;  // type of module
  description: string; // textual description of module

  level2Id: string; // 2nd level uuid of the course heirarchy
  level2Label: string; // 2nd level label

  level1Id: string; // Chapter-level breakdown uuid of course heirarchy
  level1Label: string; // Chapter-level label

  order: number; // Depth First Order of the module
  uniqueStudents: number; // # of unique students in this module
  sessions: number; // # of student sessions in which the module was accessed
  days: number; // # of days in which the student accessed the module
  events: number; // total # of interaction events
  totalTime: number; // total time to complete module in minutes

  forwardIndegree: number; // in-degree of forward event edges
  backwardIndegree: number; // in-degree of backward event edges

  forwardOutdegree: number; // out-degree of forward event edges
  backwardOutdegree: number; // out-degree of backward event edges
}

export interface Transition {
  source: string; // from module uuid
  target: string; // to module uuid

  sourceOrder: number; // [source] order of the module, same as module.order
  sourceSessionId: string; // [source] edx session id
  sourceTemporalSessionId: number; // [source] calculated temporal session (his 25th session)

  targetOrder: number; // [target] order of the module, same as module.order
  targetSessionId: string; // [target] edx session id
  targetTemporalSessionId: number; // [target] calculated temporal session (his 25th session)

  dir: string; // ?? (TBD)
  distance: number; // distance. difference between temporal sequence position - source position. + is forward, - is backward
  timestamp: string; // EST or UTC source time that the event happened (probably when they landed on target module)
  userId: number; // user for the edge
}

export interface Trajectory {
  modules: CourseModule[],
  transitions: Transition[]
}
