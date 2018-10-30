import { IResolvers } from 'apollo-server';

export class Resolver {
  readonly resolvers: IResolvers = {
    Query: {
      courseModules: (root, args, context) => this.queryCourseModules(context, args),
      transitions: (root, args, context) => this.getTransitions(args, context),
      courses: (root, args, context) => this.getCourses(args, context),
      students: (root, args, context) => this.getStudents(args, context)
    }
  };

  async queryCourseModules(context, args): Promise<any> {
    const secondary_query = args.user_id === -1 ? 'WHERE true' : ` WHERE course_id in (
                                                SELECT course_id from \`learning_trajectories.students\`
                                                WHERE user_id = ${args.user_id} )`;
    const query = `SELECT * FROM \`learning_trajectories.course_modules\` ${secondary_query}`;
    const courseModules = await context.db.query(query);
    return courseModules[0];
  }

  async getCourses(args, context: any): Promise<any> {
    const secondary_query = args.user_id === -1 ? 'WHERE true' : ` WHERE course_id in (
                                                    SELECT course_id from \`learning_trajectories.students\`
                                                    WHERE user_id = ${args.user_id}
                                                    )`;
    const query = `SELECT * FROM \`learning_trajectories.courses\` ${secondary_query}`;
    const courses = await context.db.query(query);
    return courses[0];
  }

  async getTransitions(args, context: any): Promise<any> {
    const where_condition = args.user_id === -1 ? 'WHERE true' : 'WHERE user_id = ' + args.user_id;
    const transitions = await context.db.query(`
      SELECT * FROM learning_trajectories.transitions ${where_condition}
    `);
    return transitions[0];
  }

  async getStudents(args, context: any): Promise<any> {
    const students = await context.db.query(`
      SELECT * FROM learning_trajectories.students WHERE user_id = ${args.user_id}
    `);
    return students[0];
  }
}



export const resolvers = [ new Resolver().resolvers ];
