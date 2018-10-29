import { BigQueryBuilder } from '../shared/big-query-builder';
import { IResolvers } from 'apollo-server';

export class Resolver {
  readonly resolvers: IResolvers = {
    Query: {
      courseModules: (root, args, context) => this.queryOptions('*',
        '`learning_trajectories.course_modules`', '1=1'),
      transitions: (root, args, context) => this.queryOptions('*',
        '`learning_trajectories.transitions`', '1=1'),
      courses: (root, args, context) => this.queryOptions('*',
        '`learning_trajectories.courses`', '1=1'),
      students: (root, args, context) => this.queryOptions('*',
        '`learning_trajectories.students`', '1=1'),
    }
  };

  async queryOptions(columns, tableName, whereCondition): Promise<any> {
    const x = await new BigQueryBuilder(columns, tableName, whereCondition).runQuery();
    return x[0];
  }
}

export const resolvers = [ new Resolver().resolvers ];
