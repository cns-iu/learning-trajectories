import { Injectable } from '@angular/core';

import { DatabaseService } from 'learning-trajectories-database';
import { selector } from './selector';

@Injectable()
export class PersonSelectorDataService {
  persons: selector<string>[];

  constructor(private dataService: DatabaseService) { 
    dataService.getPersonNames().subscribe((names) => {
      this.persons = names.map((name) => {
        return {
          value: name, 
          viewValue: name.charAt(0).toUpperCase() 
            + name.slice(1, name.length - 1) 
            + ' ' 
            + name.charAt(name.length - 1)
        };
      })
    });
  }


}
