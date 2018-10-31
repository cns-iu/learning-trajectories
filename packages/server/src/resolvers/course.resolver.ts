import { Resolver } from './resolver';


export class CourseResolver implements Resolver {
  readonly resolvers = {
    Query: {
      courses: (root, args, context) => this.getCourses(args, context)
    }
  };

  async getCourses(args, context: any): Promise<any> {
    let where = '';
    if (args.user_id && args.user_id !== -1) {
      where = `
        WHERE course_id in (
          SELECT course_id from learning_trajectories.students
          WHERE user_id = ${args.user_id}
        )
      `;
    }
    const query = `SELECT * FROM learning_trajectories.courses ${where}`;
    const courses = await context.db.query(query);
    return courses[0];
  }
}
