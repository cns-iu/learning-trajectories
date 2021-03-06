import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/delay';

import { Filter, MetaFilter } from '../shared/filter';
import { CourseModule, Transition } from '../shared/trajectory';
import { database } from './database';
import { PersonMetaData } from '../shared/person-metadata';
import { DatabaseService } from '../shared/database.service';

@Injectable()
export class GindaDatabaseService extends DatabaseService {

  constructor() { super(); }

  getNodes(filter: Partial<Filter> = {}): Observable<CourseModule[]> {
    let nodes: CourseModule[];
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      // TODO 'course-filter', right now it returns the nodes for the first course taken
      nodes = database.linearNetworks.get(filter.personName).first().nodes;
    } else {
      nodes = database.linearNetworks.get(database.linearNetworks.keySeq().first()).first().nodes;
    }

    if (!filter.includeUnused) {
      nodes = nodes.filter((n) => n.events > 0);
    }

    return Observable.of(nodes).delay(1);
  }

  getEdges(filter: Partial<Filter> = {}): Observable<Transition[]> {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      // TODO 'course-filter', right now it returns the edges for the first course taken
      return Observable.of(
        database.linearNetworks.get(filter.personName).first().edges
      ).delay(1);
    } else {
      return Observable.of(
        database.linearNetworks.get(database.linearNetworks.keySeq().first()).first().edges
      ).delay(1);
    }
  }

  getRawPersonName(filter: Partial<Filter> = {}): Observable<string> {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      // TODO 'course-filter', right now it returns the rawPersonName for the first course taken
      return Observable.of(
        database.linearNetworks.get(filter.personName).first().rawPersonName
      );
    } else {
      return Observable.of(
        database.linearNetworks.get(database.linearNetworks.keySeq().first()).first().rawPersonName
      );
    }
  }

  getPersonNames(filter: Partial<MetaFilter> = {}): Observable<string[]>{
    let filtered = database.linearNetworks.map((value) => value.first());
    if (filter.education) {
      const education = filter.education;
      filtered = filtered.filter((network) => {
        return network.metadata.levelOfEducation === education;
      });
    }
    if (filter.age) {
      const [min, max] = filter.age;
      filtered = filtered.filter((network) => {
        const age = network.metadata.born;
        return min <= age && age <= max;
      });
    }
    if (filter.grade) {
      const [min, max] = filter.grade;
      filtered = filtered.filter((network) => {
        const grade = Number(network.metadata.grade.slice(0, -1));
        return min <= grade && grade <= max;
      });
    }
    if (filter.course) {
      filtered = filtered.filter((network) => {
        return network.personCourseIds.includes(filter.course);
      });
    }
    return Observable.of(filtered.keySeq().toArray());
  }

  getCourseIds(filter: Partial<Filter> = {}): Observable<string[]> {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      return Observable.of(
        database.linearNetworks.get(filter.personName).keySeq().toArray()
      );
    } else {
      return Observable.of(database.courseMetaData.keySeq().toArray());
    }
  }

  getCourseMetadata(): Observable<{ [id: string]: any }> {
    return Observable.of(database.courseMetaData.toJS());
  }

  getPersonMetaData(filter: Partial<Filter> = {}) : Observable<PersonMetaData> {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      return Observable.of(
        database.linearNetworks.get(filter.personName).first().metadata
      );
    } else {
      const data = database.linearNetworks.valueSeq().map((map) => map.first());
      const metadata = data.map((item) => item.metadata);
      return Observable.from(metadata.toArray());
    }
  }
}
