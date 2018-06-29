import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

import { Filter } from './filter';
import { CourseModule, Transition } from './trajectory';
import { database } from '../ginda-data/database';
import { PersonMetaData } from './person-metadata';


@Injectable()
export class DatabaseService {

  constructor() { }

  getNodes(filter: Partial<Filter> = {}): Observable<CourseModule[]> {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      // TODO 'course-filter', right now it returns the nodes for the first course taken
      return Observable.of(
        database.linearNetworks.get(filter.personName).first().nodes
        ).delay(1);
    } else {
      return Observable.of(
        database.linearNetworks.get(database.linearNetworks.keySeq().first()).first().nodes
      ).delay(1);
    }
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

  getPersonNames(): Observable<string[]>{
    return Observable.of(database.linearNetworks.keySeq().toArray());
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
      return Observable.of(
        database.linearNetworks.get(database.linearNetworks.keySeq().first()).first().metadata
      );
    }
  }

}
