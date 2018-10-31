import { Resolver } from './resolver';
import { GraphQLContext } from '../shared/context';


export class CourseResolver implements Resolver {
  readonly resolvers = {
    Query: {
      courses: (root, args, context) => this.getCourses(args, context)
    }
  };

  async getCourses(args, context: GraphQLContext): Promise<any> {
    let where = ' LIMIT 1000';
    if (args.filter && args.filter.user_id) {
      where = `
        WHERE course_id in (
          SELECT course_id from learning_trajectories.students
          WHERE user_id = ${args.filter.user_id}
        )
      `;
    }
    const query = `SELECT * FROM learning_trajectories.courses ${where}`;
    const courses = await context.db.query(query);
    return courses[0];
  }
}
