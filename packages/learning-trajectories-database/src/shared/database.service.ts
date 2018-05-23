import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Filter } from './filter';
import { CourseModule, Transition } from './trajectory'; 
import { database } from './database';

@Injectable()
export class DatabaseService {

  constructor() { }

  getNodes(filter: Partial<Filter> = {}): Observable<CourseModule[]> {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      // TODO 'course-filter', right now it returns the nodes for the first course taken
      return Observable.of(
        database.linearNetworks.get(filter.personName).first().nodes
        );
    } else {
      return Observable.of(
        database.linearNetworks.get(database.linearNetworks.keySeq().first()).first().nodes
      );
    }
  }

  getEdges(filter: Partial<Filter> = {}): Observable<Transition[]> {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      // TODO 'course-filter', right now it returns the edges for the first course taken
      return Observable.of(
        database.linearNetworks.get(filter.personName).first().edges
      );
    } else {
      return Observable.of(
        database.linearNetworks.get(database.linearNetworks.keySeq().first()).first().edges
      );
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

  getPersonNames(): Observable<string[]>{
    return Observable.of(database.linearNetworks.keySeq().toArray());
  }

}