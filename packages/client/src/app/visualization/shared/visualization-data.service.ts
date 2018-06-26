import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { simpleField, RawChangeSet } from '@ngx-dino/core';
import { access } from '@ngx-dino/core/src/operators/methods/extracting/access';
import { chain } from '@ngx-dino/core/src/operators/methods/grouping/chain';
import { map } from '@ngx-dino/core/src/operators/methods/transforming/map';

import { Filter, DatabaseService } from 'learning-trajectories-database';


@Injectable()
export class VisualizationDataService {
  private nodeStatistics = {
    maxNumEvents: 0
  };
  private edgeStatistics = {
    maxDistance: 0,
    maxCount: 0
  };

  readonly nodeWeightField = simpleField({
    label: 'Node Weight',
    operator: chain(access<number>('events'), map((e) => {
      return e / this.nodeStatistics.maxNumEvents * .75 + .25;
    }))
  });

  // for legend labels original encoding data is needed.
  readonly nodeSizeField = simpleField({
    label: 'Node Size',
    operator: chain(access<number>('events'), map((e) => {
      return e;
    }))
  });

  readonly edgeWeightField = simpleField({
    label: 'Edge Weight',
    operator: chain(access<number>('count'), map((c) => {
      return .1;
      // return c / this.edgeStatistics.maxCount * .75 + .25;
      // return Math.abs(d) / this.edgeStatistics.maxDistance * .75 + .25;
    }))
  });

  // for legend labels original encoding data is needed.
  readonly edgeSizeField = simpleField({
    label: 'Edge Size',
    operator: chain(access<number>('distance'), map((d) => {
      return d;
    }))
  });

  // edge color does not have an encoding right now
  readonly edgeColorField = simpleField({
    label: 'Edge Color',
    operator: map((d) => '#3D3D3D')
  });


  constructor(private database: DatabaseService) { }

  getNodes(filter: Partial<Filter> = {}): Observable<any> {
    return this.database.getNodes(filter).do((nodes) => {
      let maxNumEvents = 0;
      nodes.forEach((node) => {
        maxNumEvents = Math.max(node.events, maxNumEvents);
      });

      this.nodeStatistics.maxNumEvents = maxNumEvents;
    }).map(RawChangeSet.fromArray);
  }

  getEdges(filter: Partial<Filter> = {}): Observable<any> {
    return this.database.getEdges(filter).do((edges) => {
      let maxDistance = 0;
      let maxCount = 0;
      edges.forEach((edge) => {
        maxDistance = Math.max(Math.abs(edge.distance), maxDistance);
        maxCount = Math.max(edge.count, maxCount);
      });

      this.edgeStatistics.maxDistance = maxDistance;
      this.edgeStatistics.maxCount = maxCount;
    }).map(RawChangeSet.fromArray);
  }

  getTitle(filter: Partial<Filter> = {}): string {
    let title: string;
    this.database.getCourseTitle(filter).subscribe((t) => title = t);
    return title;
  }
}
