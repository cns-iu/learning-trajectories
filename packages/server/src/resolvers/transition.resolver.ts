import { Resolver } from './resolver';
import { GraphQLContext } from '../shared/context';


export class TransitionResolver implements Resolver {
  readonly resolvers = {
    Query: {
      transitions: (root, args, context) => this.getTransitions(args, context)
    }
  };

  async getTransitions(args, context: GraphQLContext): Promise<any> {
    let where = ' LIMIT 1000';
    if (args.filter && args.filter.user_id) {
      where = `
        WHERE user_id = ${args.filter.user_id}
      `;
    }
    const query = `SELECT * FROM learning_trajectories.transitions ${where}`;
    const transitions = await context.db.query(query);
    return transitions[0].map(t => (t.time = t.time ? t.time.value : null, t));
  }
}
