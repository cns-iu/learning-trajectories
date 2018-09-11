import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Map } from 'immutable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/operator/reduce';

import { DatabaseService, MetaFilter } from 'learning-trajectories-database';

function displayName(id: string): string {
  const re = /(\D)(\D*)(\d*)/;
  const match = re.exec(id);
  return match[1].toUpperCase() + match[2] + ' ' + match[3];
}

function namesToMap(names: string[]): Map<string, string> {
  return Map(names.map((name) => [displayName(name), name]));
}

function updateRange(range: [number, number], value: number | string): [number, number] {
  const [min, max] = range;
  const num = Number(value);
  if (isNaN(num)) {
    return range;
  } else if (min === undefined || max === undefined) {
    return [min || num, max || num];
  } else if (num < min) {
    return [num, max];
  } else if (num > max) {
    return [min, num];
  } else {
    return range;
  }
}

@Injectable()
export class PersonSelectorDataService {
  readonly mapping: Observable<Map<string, string>>;
  readonly yearRange: Observable<[number, number]>;
  readonly education: Observable<string[]>;
  private readonly innerMapping = new Subject<Observable<Map<string, string>>>();

  constructor(private dataService: DatabaseService) {
    this.mapping = this.innerMapping.mergeAll();
    this.yearRange = dataService.getPersonMetaData()
      .map((meta) => meta.born)
      .reduce(updateRange, [undefined, undefined]) as Observable<[number, number]>;
    this.education = dataService.getPersonMetaData()
      .map((meta) => meta.levelOfEducation)
      .reduce((set, ed) => (set.add(ed), set), new Set<string>())
      .map((set) => (set.delete(''), set))
      .map((set) => Array.from(set.values()));

    this.update();
  }

  update(filter: Partial<MetaFilter> = {}): void {
    const names = this.dataService.getPersonNames(filter);
    const map = names.map(namesToMap);
    this.innerMapping.next(map);
  }
}
