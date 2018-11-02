import { Filter, MetaFilter } from './filter';
import { Observable } from 'rxjs/Observable';
import { CourseModule, Transition } from './trajectory';
import { PersonMetaData } from './person-metadata';
import { Injectable } from '@angular/core';

@Injectable()
export class DatabaseService {
  getNodes(filter?: Partial<Filter>): Observable<CourseModule[]> {
    return Observable.of([]);
  }
  getEdges(filter?: Partial<Filter>): Observable<Transition[]>{
    return Observable.of([]);
  }
  getRawPersonName(filter?: Partial<Filter>): Observable<string> {
    return Observable.of('');
  }
  getPersonNames(filter?: Partial<MetaFilter>): Observable<string[]> {
    return Observable.of([]);
  }
  getCourseIds(filter?: Partial<Filter>): Observable<string[]> {
    return Observable.of([]);
  }
  getCourseMetadata(): Observable<{ [id: string]: any }> {
    return Observable.of({});
  }
  getPersonMetaData(filter?: Partial<Filter>) : Observable<PersonMetaData> {
    return Observable.of(<PersonMetaData>{});
  }
}
