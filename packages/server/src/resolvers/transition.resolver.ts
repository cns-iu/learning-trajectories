import { Resolver } from './resolver';
import { GraphQLContext } from '../shared/context';


export class TransitionResolver implements Resolver {
  readonly resolvers = {
    Query: {
      transitions: (root, args, context) => this.getTransitions(args, context)
    }
  };

  async getTransitions(args, context: GraphQLContext): Promise<any> {
    let query = 'SELECT * FROM learning_trajectories.transitions';
    const where = [], params: any = {};
    if (args.filter) {
      if (args.filter.user_id) {
        where.push('user_id = @user_id AND direction != \'sl\'');
        params.user_id = Number(args.filter.user_id);
      }
    }
    if (where.length === 0) {
      // query += ' LIMIT 1000';
      return [];
    } else {
      query += ` WHERE ${where.join(' AND ')}`;
    }
    console.log(JSON.stringify({query, params}));
    const results = await context.db.query({query, params});
    return results[0].map(t => (t.time = t.time ? t.time.value : null, t));
  }
}
