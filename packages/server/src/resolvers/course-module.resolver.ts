import { Resolver } from './resolver';
import { GraphQLContext } from '../shared/context';


export class CourseModuleResolver implements Resolver {
  readonly resolvers = {
    Query: {
      courseModules: (root, args, context) => this.getCourseModules(args, context)
    }
  };

  async getCourseModules(args, context: GraphQLContext): Promise<any> {
    let query = 'SELECT *, 0 AS events FROM learning_trajectories.course_modules AS CM';
    const where = [], params: any = {};
    if (args.filter) {
      if (args.filter.user_id) {
        query = `
          WITH E AS (
            SELECT course_id, module_id, count(*) AS events, ceil(sum(duration)) AS duration
            FROM learning_trajectories.transitions
            WHERE user_id = @user_id
            GROUP BY course_id, module_id
          )
          SELECT CM.*, coalesce(E.events, 0) as events, coalesce(E.duration, 0) AS duration
          FROM
            learning_trajectories.course_modules AS CM
            LEFT OUTER JOIN E ON (E.course_id = CM.course_id AND E.module_id = CM.module_id)
        `;
        params.user_id = Number(args.filter.user_id);

        if (!args.filter.includeUnused) {
          where.push(`E.events IS NOT NULL`);
        } else {
          where.push(`true`);
        }
      }
      if (args.filter.course) {
        where.push('CM.course_id = @course_id');
        params.course_id = args.filter.course;
      }
    }
    if (where.length === 0) {
      // query += ' LIMIT 1000';
      return [];
    } else {
      query += ` WHERE ${where.join(' AND ')} ORDER BY first_leaf_index`;
    }
    console.log(JSON.stringify({query, params}));
    const results = await context.db.query({query, params});
    return results[0];
  }
}
