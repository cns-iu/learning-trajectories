import { CourseModule, Transition } from './trajectory';

export class LinearNetwork {
  readonly directed: string;
  readonly rawPersonName: string;
  readonly nodes: CourseModule[];
  readonly edges: Transition[];

  constructor (rawPerson: any) {
    this.directed = rawPerson.directed[0] as string;
    this.rawPersonName = rawPerson.name[0] as string;
    this.nodes =  (rawPerson.vertices || []).map((m) => this.getNode(m));
    this.edges = (rawPerson.edges || []).map((e) => this.getEdge(e));
  }

  getNode(vertex: any) {
    const courseModule = {
        id: vertex.name,
        courseId: vertex.courseID,
        moduleType: vertex['module.type'],
        description: vertex.desc,
        
        level2Id: vertex.L2,
        level2Label: vertex.L2label,
        level1Id: vertex.L1,
        level1Label: vertex.L1label,

        order: vertex.order ,
        uniqueStudents: vertex.unq_stu ,
        sessions: vertex.sessions ,
        days: vertex.days ,
        events: vertex.events ,
        totalTime: vertex.totalTime ,

        forwardIndegree: vertex.progress_i ,
        backwardIndegree: vertex.recurse_i ,

        forwardOutdegree: vertex.forward_o,
        backwardOutdegree: vertex.backward_o,

        selfLoopCount: vertex.sl
      } as CourseModule;
    
    return courseModule;
  }

  getEdge(edge: any) {
    const courseTransition = {
      source: edge.from,
      target: edge.to,

      sourceOrder: edge['s.seqpos'] as number,
      sourceSessionId: edge['s.session'],
      sourceTemporalSessionId: edge['s.tsession'],

      targetOrder: edge['t.seqpos'],
      targetSessionId: edge['t.session'],
      targetTemporalSessionId: edge['t.tsession'],

      dir: edge.dir, // TODO name

      distance: edge.dis,
      timestamp: edge.time,
      userId: edge.user_id,

      selfLoopFlag: Boolean(edge.sl)
    } as Transition;

    return courseTransition;
  }

}