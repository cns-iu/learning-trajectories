import { Resolver } from './resolver';
import { GraphQLContext } from '../shared/context';


export class StudentResolver implements Resolver {
  readonly resolvers = {
    Query: {
      students: (root, args, context) => this.getStudents(args, context)
    }
  };

  async getStudents(args, context: GraphQLContext): Promise<any> {
    let query = 'SELECT * FROM learning_trajectories.students';
    const where = [], params: any = {};
    if (args.filter) {
      if (args.filter.user_id) {
        where.push('user_id = @user_id');
        params.user_id = Number(args.filter.user_id);
      }
      if (args.filter.born) {
        where.push('YoB BETWEEN @minYear AND @maxYear');
        params.minYear = args.filter.born.min;
        params.maxYear = args.filter.born.max;
      }
      if (args.filter.grade) {
        where.push('grade BETWEEN @minGrade AND @maxGrade');
        params.minGrade = args.filter.grade.min / 100.0;
        params.maxGrade = args.filter.grade.max / 100.0;
      }
      if (args.filter.course) {
        where.push('course_id = @course_id');
        params.course_id = args.filter.course;
      }
      if (args.filter.education) {
        where.push('LoE = @education');
        params.education = args.filter.education;
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
