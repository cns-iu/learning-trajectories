import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

import { Filter } from './filter';
import { CourseModule, Transition } from './trajectory';
import { database } from './database';


@Injectable()
export class DatabaseService {

  constructor() { }

  getNodes(filter: Partial<Filter> = {}): Observable<CourseModule[]> {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      return Observable.of(database.linearNetworks.get(filter.personName).nodes).delay(1);
    } else {
      return Observable.of(database.linearNetworks.get(database.linearNetworks.keySeq().first()).nodes).delay(1);
    }
  }

  getEdges(filter: Partial<Filter> = {}): Observable<Transition[]> {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      return Observable.of(database.linearNetworks.get(filter.personName).edges).delay(1);
    } else {
      return Observable.of(database.linearNetworks.get(database.linearNetworks.keySeq().first()).edges).delay(1);
    }
  }

  getRawPersonName(filter: Partial<Filter> = {}): string {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      return database.linearNetworks.get(filter.personName).rawPersonName;
    } else {
      return database.linearNetworks.get(database.linearNetworks.keySeq().first()).rawPersonName;
    }
  }

}
