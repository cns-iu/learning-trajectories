import { BigQueryBuilder } from '../shared/big-query-builder';
import { IResolvers } from 'apollo-server';

export class Resolver {
  readonly resolvers: IResolvers = {
    Query: {
      courseModules: (root, args, context) => this.queryOptions('*',
        '`learning_trajectories.course_modules`', '1=1', context),
      transitions: (root, args, context) => this.queryOptions('*',
        '`learning_trajectories.transitions`', '1=1', context),
      courses: (root, args, context) => this.getCourses(args, context),
      students: (root, args, context) => this.queryOptions('*',
        '`learning_trajectories.students`', '1=1', context),
    }
  };

  async queryOptions(columns, tableName, whereCondition, context): Promise<any> {
    const x = await new BigQueryBuilder(columns, tableName, whereCondition, context.db).runQuery();
    return x[0];
  }

  async getCourses(args, context: any): Promise<any> {
    const courses = await context.db.query(`
      SELECT * FROM learning_trajectories.courses
    `);
    return courses[0];
  }
}

export const resolvers = [ new Resolver().resolvers ];
