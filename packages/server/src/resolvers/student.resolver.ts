import { Resolver } from './resolver';


export class StudentResolver implements Resolver {
  readonly resolvers = {
    Query: {
      students: (root, args, context) => this.getStudents(args, context)
    }
  };

  async getStudents(args, context: any): Promise<any> {
    let where = '';
    if (args.user_id && args.user_id !== -1) {
      where = `
        WHERE course_id in (
          SELECT course_id from learning_trajectories.students
          WHERE user_id = ${args.user_id}
        )
      `;
    }
    const query = `SELECT * FROM learning_trajectories.students ${where}`;
    const students = await context.db.query(query);
    return students[0];
  }
}
