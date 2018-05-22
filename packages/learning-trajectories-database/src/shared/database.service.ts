import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Filter } from './filter';

import { CourseModule, Transition } from './trajectory'; 

import { database } from './database';

@Injectable()
export class DatabaseService {

  constructor() { }

  getNodes(filter: Partial<Filter> = {}): CourseModule[] {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      return database.linearNetworks.get(filter.personName).nodes;
    } else {
      return [];
    }
  }

  getEdges(filter: Partial<Filter> = {}): Transition[] {
    if (filter.personName && database.linearNetworks.has(filter.personName)) {
      return database.linearNetworks.get(filter.personName).edges;
    } else {
      return [];
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