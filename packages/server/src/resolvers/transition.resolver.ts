import { Resolver } from './resolver';


export class TransitionResolver implements Resolver {
  readonly resolvers = {
    Query: {
      transitions: (root, args, context) => this.getTransitions(args, context)
    }
  };

  async getTransitions(args, context: any): Promise<any> {
    let where = '';
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
