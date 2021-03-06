import { Observable } from 'rxjs/Observable';
import { GraphQLClient } from 'graphql-request';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';

import { Filter, MetaFilter } from '../shared/filter';
import { CourseModule, Transition } from '../shared/trajectory';
import { PersonMetaData } from '../shared/person-metadata';
import { Injectable } from '@angular/core';
import { DatabaseService } from '../shared/database.service';

import { asCourseModule, asTransition, postProcessTransitions, asPersonMetaData, 
  getCourseModulesQuery, getTransitionsQuery, getStudentIdsQuery, getStudentsQuery, getCoursesQuery } from './graphql-queries';
import { GraphQLFilter, GraphQLStudentFilter } from './graphql-filter';


@Injectable()
export class GraphQLDatabaseService extends DatabaseService {
  endpoint = 'graphql'; // TODO: make configurable
  client: GraphQLClient;
  private cache: any = {};

  constructor() {
    super();
    this.client = new GraphQLClient(this.endpoint, {
      credentials: 'include',
      mode: 'cors'
    });
  }

  query<T = any>(query: string, selector: string, vars?: any, ignoreCache?: boolean): Observable<T[]> {
    const key = JSON.stringify({query, vars});
    if (!this.cache.hasOwnProperty(key)) {
      this.cache[key] = (async () => {
        const results = (await this.client.request(query, vars))[selector];
        return results;
      })();
    }
    return Observable.fromPromise(this.cache[key]);
  }

  getNodes(filter?: Partial<Filter>): Observable<CourseModule[]> {
    return this.query(getCourseModulesQuery, 'courseModules', {filter: new GraphQLFilter(filter)})
      .map(results => results.map(asCourseModule));
  }
  getEdges(filter?: Partial<Filter>): Observable<Transition[]>{
    return this.query(getTransitionsQuery, 'transitions', {filter: new GraphQLFilter(filter)})
      .map(results => postProcessTransitions(results.map(asTransition)));
  }
  getRawPersonName(filter?: Partial<Filter>): Observable<string> {
    return this.query(getStudentIdsQuery, 'students', {filter: new GraphQLFilter(filter)})
      .map(results => results.length ? results[0].user_id : '');
  }
  getPersonNames(filter?: Partial<MetaFilter>): Observable<string[]> {
    return this.query(getStudentIdsQuery, 'students', {filter: new GraphQLStudentFilter(filter)})
      .map(results => results.map(s => s.user_id));
  }
  getCourseIds(filter?: Partial<Filter>): Observable<string[]> {
    return this.query(getCoursesQuery, 'courses', {filter: new GraphQLFilter(filter)})
      .map(results => results.map(c => c.course_id));
  }
  getCourses(): Observable<{id: string, title: string}[]> {
    return this.query(getCoursesQuery, 'courses')
      .map(results => results.map(c => ({id: c.course_id, title: c.course_title})));
  }
  getCourseMetadata(): Observable<{ [id: string]: any }> {
    return this.getCourses().map(courses => {
      const metadata: { [id: string]: any } = {};
      courses.forEach(c => metadata[c.id] = c);
      return metadata;
    });
  }
  getPersonMetaData(filter?: Partial<Filter>) : Observable<PersonMetaData> {
    return this.query(getStudentsQuery, 'students', {filter: new GraphQLStudentFilter(filter)})
      .map(results => filter ? (results.length ? asPersonMetaData(results[0]) : null) : <any>results.map(asPersonMetaData));
  }
}
