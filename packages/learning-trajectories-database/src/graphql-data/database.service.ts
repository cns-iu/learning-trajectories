import { Observable } from 'rxjs/Observable';
import { request } from 'graphql-request';
import 'rxjs/add/observable/fromPromise';

import { Filter, MetaFilter, GraphQLFilter, GraphQLStudentFilter, GraphQLFilterBuilder, GraphQLStudentFilterBuilder } from '../shared/filter';
import { CourseModule, Transition } from '../shared/trajectory';
import { PersonMetaData } from '../shared/person-metadata';
import { Injectable } from '@angular/core';
import { DatabaseService } from '../shared/database.service';


@Injectable()
export class GraphQLDatabaseService extends DatabaseService {
  endpoint = 'http://localhost:4000/graphql';

  constructor() {
    super();
    this.getCourseIds({personName: '11428379'}).subscribe((data) => {console.log(data);});
  }

  getNodes(filter?: Partial<Filter>): Observable<CourseModule[]> {
    
    const query = `
    query getCourseModules($filter: Filter) {
        courseModules(filter: $filter) {
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
      }
    `;
    const filterVariables: GraphQLFilter = new GraphQLFilterBuilder(filter).getGraphQLFilter();
    const courseModulePromoise: Promise<CourseModule[]> = request(this.endpoint, query, {'filter': filterVariables});
    return Observable.fromPromise(courseModulePromoise);
  }
  getEdges(filter?: Partial<Filter>): Observable<Transition[]>{
    const query =  `
    query getTransitions($filter: Filter){
      transitions( filter: $filter){
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
    }`;
    const filterVariables: GraphQLFilter = new GraphQLFilterBuilder(filter).getGraphQLFilter();
    const transitionsPromise: Promise<Transition[]> = request(this.endpoint,query, {'filter': filterVariables});
    return Observable.fromPromise(transitionsPromise);
  }
  getRawPersonName(filter?: Partial<Filter>): Observable<string> {
    return Observable.of('');
  }
  getPersonNames(filter?: Partial<MetaFilter>): Observable<string[]> {
    const query = `
    query getStudents( $filter: Filter ){
      students( filter: $filter ){
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
    }`;
    const filterVariables: GraphQLStudentFilter = new GraphQLStudentFilterBuilder(filter, null).getGraphQLStudentFilter();
    const personPromise: Promise<PersonMetaData> = request(this.endpoint, query,{'filter': filterVariables} );
    return Observable.of([]);
  }
  getCourseIds(filter?: Partial<Filter>): Observable<string[]> {
    const query=  `
    query getCourses($filter: Filter) {
      courses( filter: $filter){
        course_id
      }
    }`;
    const filterVariables: GraphQLFilter = new GraphQLFilterBuilder(filter).getGraphQLFilter();
    const coursePromise: Promise<string[]> = request(this.endpoint, query, {'filter': filterVariables}) ;
    return Observable.fromPromise(coursePromise);
  }
  getCourseMetadata(): { [id: string]: any } {
    return {};
  }
  getPersonMetaData(filter?: Partial<Filter>) : Observable<PersonMetaData> {
    const query = `
    query getStudents( $filter: Filter ){
      students( filter: $filter ){
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
    }`;
    const filterVariables: GraphQLFilter = new GraphQLFilterBuilder(filter).getGraphQLFilter();
    const personPromise: Promise<PersonMetaData> = request(this.endpoint, query,{'filter': filterVariables} );
    return Observable.fromPromise(personPromise);
  }
}
