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
    if (args.user_id && args.user_id !== -1) {
      where = `
        WHERE user_id = ${args.user_id}
      `;
    }
    const query = `SELECT * FROM learning_trajectories.transitions ${where}`;
    const transitions = await context.db.query(query);
    return transitions[0];
  }
}
