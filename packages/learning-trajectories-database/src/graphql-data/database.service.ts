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
    this.getNodes({personName: '11428379'}).subscribe((data) => {console.log(data);});
  }

  getNodes(filter?: Partial<Filter>): Observable<CourseModule[]> {
    
    const courseModulePromoise: Promise<CourseModule[]> = request(this.endpoint, `{
      courseModules( user_id: ${filter && filter.personName || -1} ){
        module_id
        course_id
        category
        name
        chapter_id
        sequential_id
        vertical_id
        level
        index
        first_leaf_index
      }
    }`);
    return Observable.fromPromise(courseModulePromoise);
  }
  getEdges(filter?: Partial<Filter>): Observable<Transition[]>{
    const transitionsPromise: Promise<Transition[]> = request(this.endpoint, `{
      transitions( user_id: ${filter && filter.personName || -1} ){
        user_id
        course_id
        index
        module_id
        next_module_id
        next_index
        direction
        distance
        event_type
        duration
        time
      }
    }`);
    return Observable.fromPromise(transitionsPromise);
  }
  getRawPersonName(filter?: Partial<Filter>): Observable<string> {
    return Observable.of('');
  }
  getPersonNames(filter?: Partial<MetaFilter>): Observable<string[]> {
    return Observable.of([]);
  }
  getCourseIds(filter?: Partial<Filter>): Observable<string[]> {
    const coursePromise: Promise<string[]> = request(this.endpoint, `{
      courses( user_id: ${filter && filter.personName || -1} ){
        course_id
      }
    }`);
    return Observable.fromPromise(coursePromise);
  }
  getCourseMetadata(): { [id: string]: any } {
    return {};
  }
  getPersonMetaData(filter?: Partial<Filter>) : Observable<PersonMetaData> {
    const personPromise: Promise<PersonMetaData> = request(this.endpoint, `{
      students( user_id: ${filter && filter.personName || -1} ){
        user_id
        course_id
        grade
        gender
        LoE
        YoB
        cert_created_date
        cert_modified_date
        cert_status
      }
    }`);
    return Observable.fromPromise(personPromise);
  }
}
