import { Resolver } from './resolver';
import { GraphQLContext } from '../shared/context';


export class StudentResolver implements Resolver {
  readonly resolvers = {
    Query: {
      students: (root, args, context) => this.getStudents(args, context)
    }
  };

  async getStudents(args, context: GraphQLContext): Promise<any> {
    let where = 'true ';
    if (args.filter) {
      if (args.filter.user_id) {
        where += `
           and user_id = ${args.filter.user_id}
        `;
      }
      if (args.filter.age) {
        const currentYear = new Date().getFullYear();
        where += `
           and YoB BETWEEN ${currentYear - args.filter.age.max} and ${currentYear - args.filter.age.min}
        `;
      }
      if (args.filter.grade) {
        where += `
           and grade BETWEEN ${args.filter.grade.min} and ${args.filter.grade.max}
        `;
      }
      if (args.filter.course) {
        where += `
           and course_id = '${args.filter.course}'
        `;
      }
    }
    if (where === 'true ') {
      where = ' LIMIT 1000';
    }
    const query = `SELECT * FROM learning_trajectories.students WHERE ${where}`;
    console.log(query);
    const students = await context.db.query(query);
    return students[0];
  }
}
