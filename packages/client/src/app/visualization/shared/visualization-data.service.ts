import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { simpleField, RawChangeSet } from '@ngx-dino/core';
import { access } from '@ngx-dino/core/src/v2/operators/methods/extracting/access';
import { chain } from '@ngx-dino/core/src/v2/operators/methods/grouping/chain';
import { map } from '@ngx-dino/core/src/v2/operators/methods/transforming/map';

import { Filter, DatabaseService } from 'learning-trajectories-database';


function assignColors(ids: object): object {
  return ids; // FIXME
}


@Injectable()
export class VisualizationDataService {
  private nodeStatistics = {
    maxNumEvents: 0,
    level1Ids: {}
  };
  private edgeStatistics = {
    maxDistance: 0
  };

  readonly nodeWeightField = simpleField({
    label: 'Node Weight',
    operator: chain(access<number>('events'), map((e) => {
      return e / this.nodeStatistics.maxNumEvents * .75 + .25;
    }))
  });

  readonly nodeColorField = simpleField({
    label: 'nodeColor',
    operator: chain(access<string>('level1Id'), map((id) => {
      return this.nodeStatistics.level1Ids[id];
    }))
  });

  readonly edgeWeightField = simpleField({
    label: 'Edge Weight',
    operator: chain(access<number>('distance'), map((d) => {
      return Math.abs(d) / this.edgeStatistics.maxDistance * .75 + .25;
    }))
  });

  readonly edgeColorField = simpleField({
    label: 'Edge Color',
    operator: chain(access<string>('direction'), map((d) => {
      return d.toLowerCase() === 'p' ? 'lightblue' : 'purple';
    }))
  });


  constructor(private database: DatabaseService) { }

  getNodes(filter: Partial<Filter> = {}): Observable<any> {
    return this.database.getNodes(filter).do((nodes) => {
      let maxNumEvents = 0;
      const level1Ids = {};
      nodes.forEach((node) => {
        maxNumEvents = Math.max(node.events, maxNumEvents);
        level1Ids[node.level1Id] = true;
      });

      this.nodeStatistics.maxNumEvents = maxNumEvents;
      this.nodeStatistics.level1Ids = assignColors(level1Ids);
    }).map(RawChangeSet.fromArray);
  }

  getEdges(filter: Partial<Filter> = {}): Observable<any> {
    return this.database.getEdges(filter).do((edges) => {
      let maxDistance = 0;
      edges.forEach((edge) => {
        maxDistance = Math.max(Math.abs(edge.distance), maxDistance);
      });

      this.edgeStatistics.maxDistance = maxDistance;
    }).map(RawChangeSet.fromArray);
  }
}
