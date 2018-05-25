import { CourseModule, Transition } from './trajectory';
import { List, Map } from 'immutable';

export class LinearNetwork {
  readonly directed: string;
  readonly rawPersonName: string;
  readonly nodes: CourseModule[];
  readonly edges: Transition[];
  private moduleIdToName: Map<string, CourseModule> = Map();

  constructor (rawPerson: any) {
    this.directed = rawPerson.directed[0] as string;
    this.rawPersonName = rawPerson.name[0] as string;
    this.nodes =  (rawPerson.vertices || []).map((m) => this.getNode(m)).filter((m) => m.events > 0);
    this.edges = (rawPerson.edges || []).map((e) => this.getEdge(e));
    this.postProcessEdges(this.edges);
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

        order: vertex.order,
        uniqueStudents: vertex.unq_stu,
        sessions: vertex.sessions,
        days: vertex.days,
        events: vertex.events,
        totalTime: vertex.totalTime,

        forwardIndegree: vertex.progress_i,
        backwardIndegree: vertex.recurse_i,

        forwardOutdegree: vertex.forward_o,
        backwardOutdegree: vertex.backward_o,

        selfLoopCount: vertex.sl
      } as CourseModule;

    this.moduleIdToName = this.moduleIdToName.set(
      courseModule.id, courseModule
    );

    return courseModule;
  }

  getEdge(edge: any) {
    const courseTransition = {
      source: edge.from,
      target: edge.to,

      sourceModule: this.moduleIdToName.get(edge.from),
      targetModule: this.moduleIdToName.get(edge.to),

      sourceOrder: edge['s.seqpos'] as number,
      sourceSessionId: edge['s.session'],
      sourceTemporalSessionId: edge['s.tsession'],

      targetOrder: edge['t.seqpos'],
      targetSessionId: edge['t.session'],
      targetTemporalSessionId: edge['t.tsession'],

      direction: edge.dir,

      distance: edge.dis,
      timestamp: edge.time,
      userId: edge.user_id,

      selfLoopFlag: Boolean(edge.sl)
    } as Transition;

    return courseTransition;
  }

  private postProcessEdges(edges: Transition[]): void {
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
  }
}
