import { Resolver } from './resolver';
import { GraphQLContext } from '../shared/context';


export class CourseResolver implements Resolver {
  readonly resolvers = {
    Query: {
      courses: (root, args, context) => this.getCourses(args, context)
    }
  };

  async getCourses(args, context: GraphQLContext): Promise<any> {
    let query = 'SELECT * FROM learning_trajectories.courses';
    const where = [], params: any = {};
    if (args.filter) {
      if (args.filter.user_id) {
        where.push(`course_id in (
          SELECT course_id from learning_trajectories.students
          WHERE user_id = @user_id
        )`);
        params.user_id = Number(args.filter.user_id);
      }
    }
    if (where.length === 0) {
      query += ' LIMIT 1000';
    } else {
      query += ` WHERE ${where.join(' AND ')}`;
    }
    console.log(JSON.stringify({query, params}));
    const results = await context.db.query({query, params});
    return results[0];
  }
}
