import { Observable } from 'rxjs/Observable';
import { request } from 'graphql-request';
import 'rxjs/add/observable/fromPromise';

import { Filter, MetaFilter } from '../shared/filter';
import { CourseModule, Transition } from '../shared/trajectory';
import { PersonMetaData } from '../shared/person-metadata';
import { Injectable } from '@angular/core';
import { DatabaseService } from '../shared/database.service';


@Injectable()
export class GraphQLDatabaseService extends DatabaseService {
  endpoint = 'http://localhost:4000/graphql';

  constructor() {
    super();
    this.getNodes(null).subscribe((data) => {console.log(data);});
  }

  getNodes(filter?: Partial<Filter>): Observable<CourseModule[]> {
    let promise: Promise<CourseModule[]> = request(this.endpoint, `{
      courses{
        course_id
      }
    }`);
    return Observable.fromPromise(promise);
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
  getCourseMetadata(): { [id: string]: any } {
    return {};
  }
  getPersonMetaData(filter?: Partial<Filter>) : Observable<PersonMetaData> {
    return Observable.of(<PersonMetaData>{});
  }
}
