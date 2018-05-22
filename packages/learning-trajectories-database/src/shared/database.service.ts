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
      return Observable.of(database.linearNetworks.get(filter.personName).nodes);
    } else {
      return Observable.of([]);
    }
  }

  getEdges(filter: Partial<Filter> = {}): Observable<Transition[]> {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      return Observable.of(database.linearNetworks.get(filter.personName).edges);
    } else {
      return Observable.of([]);
    }
  }

  getRawPersonName(filter: Partial<Filter> = {}): string {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      return database.linearNetworks.get(filter.personName).rawPersonName;
    } else {
      return '';
    }
  }

}