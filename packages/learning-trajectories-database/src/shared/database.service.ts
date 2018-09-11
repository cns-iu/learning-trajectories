import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/delay';

import { Filter, MetaFilter } from './filter';
import { CourseModule, Transition } from './trajectory';
import { database } from '../ginda-data/database';
import { PersonMetaData } from './person-metadata';


@Injectable()
export class DatabaseService {

  constructor() { }

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

    return Observable.of(filtered.keySeq().toArray());
  }

  getCourseTitle(filter: Partial<Filter> = {}): Observable<string> {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      return Observable.of(
        database.linearNetworks.get(filter.personName).keySeq().first().toString()
      );
    } else {
      return Observable.of(
        database.linearNetworks.get(database.linearNetworks.keySeq().first())
        .keySeq().first().toString()
      );
    }
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
