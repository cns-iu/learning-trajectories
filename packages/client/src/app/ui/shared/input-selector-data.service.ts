import { Injectable } from '@angular/core';

import { Map } from 'immutable';

import { DatabaseService, Filter } from 'learning-trajectories-database';

@Injectable()
export class InputSelectorDataService {
  personNameToId: Map<string, string>;

  constructor(private dataService: DatabaseService) {
    dataService.getPersonNames().subscribe((names) => {
      this.personNameToId = Map(names.map((name) => {
        return [
          name.charAt(0).toUpperCase()
          + name.slice(1, name.length - 1)
          + ' '
          + name.charAt(name.length - 1),
          name
        ];
      }));
    });
  }

  getCourseIds(filter: Partial<Filter> = {}) {
    return this.dataService.getCourseIds(filter);
  }
}
