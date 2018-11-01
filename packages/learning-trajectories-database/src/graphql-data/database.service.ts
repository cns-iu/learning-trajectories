import { Observable } from 'rxjs/Observable';
import { GraphQLClient } from 'graphql-request';
import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/map';

import { Filter, MetaFilter } from '../shared/filter';
import { CourseModule, Transition } from '../shared/trajectory';
import { PersonMetaData } from '../shared/person-metadata';
import { Injectable } from '@angular/core';
import { DatabaseService } from '../shared/database.service';

import { asCourseModule, asTransition, asPersonMetaData, 
  getCourseModulesQuery, getTransitionsQuery, getStudentIdsQuery, getStudentsQuery, getCoursesQuery } from './graphql-queries';
import { GraphQLFilter, GraphQLStudentFilter } from './graphql-filter';


@Injectable()
export class GraphQLDatabaseService extends DatabaseService {
  endpoint = 'http://localhost:4000/graphql'; // TODO: make configurable
  client: GraphQLClient;
  private courseMetadata: { [id: string]: any } = {};

  constructor() {
    super();
    this.client = new GraphQLClient(this.endpoint, {
      credentials: 'include',
      mode: 'cors'
    });
    this.preloadCourseMetadata();

    // TODO: Remove me when finished testing/implementing
    this.getPersonNames({grade: [0,3], age: [20,25], course:"MITProfessionalX/SysEngxB1/3T2016"}).subscribe(console.log);
    console.log(this);
  }

  private preloadCourseMetadata() {
    this.getCourses().subscribe(courses => {
      courses.forEach(c => this.courseMetadata[c.id] = c);
    });
  }

  query<T = any>(query: string, selector: string, vars?: any): Observable<T[]> {
    return Observable.defer(async () => {
      const results = await this.client.request(query, vars);
      return results[selector];
    });
  }

  getNodes(filter?: Partial<Filter>): Observable<CourseModule[]> {
    return this.query(getCourseModulesQuery, 'courseModules', {filter: new GraphQLFilter(filter)})
      .map(results => results.map(asCourseModule));
  }
  getEdges(filter?: Partial<Filter>): Observable<Transition[]>{
    return this.query(getTransitionsQuery, 'transitions', {filter: new GraphQLFilter(filter)})
      .map(results => results.map(asTransition));
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
  getCourseMetadata(): { [id: string]: any } {
    return this.courseMetadata;
  }
  getPersonMetaData(filter?: Partial<Filter>) : Observable<PersonMetaData> {
    return this.query<PersonMetaData>(getStudentsQuery, 'students', {filter: new GraphQLStudentFilter(filter)})
      .map(results => results.length ? asPersonMetaData(results[0]) : null);
  }
}
