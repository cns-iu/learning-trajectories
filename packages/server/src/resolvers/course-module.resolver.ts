import { Resolver } from './resolver';
import { GraphQLContext } from '../shared/context';


export class CourseModuleResolver implements Resolver {
  readonly resolvers = {
    Query: {
      courseModules: (root, args, context) => this.getCourseModules(args, context)
    }
  };

  async getCourseModules(args, context: GraphQLContext): Promise<any> {
    let where = ' LIMIT 1000';
    if (args.user_id && args.user_id !== -1) {
      where = `
        WHERE course_id in (
          SELECT course_id from learning_trajectories.students
          WHERE user_id = ${args.user_id}
        )
      `;
    }
    const query = `SELECT * FROM learning_trajectories.course_modules ${where}`;
    const courseModules = await context.db.query(query);
    return courseModules[0];
  }
}
