import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import * as cors from 'cors';
import * as path from 'path';
import { createServer } from 'http';
import * as auth from 'http-auth';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { GraphQLContext } from './shared/context';


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const DEFAULT_PORT = 4000;
const PORT = process.env.PORT || DEFAULT_PORT;

const BIG_QUERY_PROJECT = process.env.BIG_QUERY_PROJECT || 'bl-sice-edx-la-visualizations';

const app = express();

const basicAuth = auth.basic({
  realm: 'Learning Trajectories',
  file: path.join(__dirname, '../../../raw-data/users.htpasswd')
});
app.use(auth.connect(basicAuth));

app.use('*', cors({ origin: process.env.CLIENT_ORIGIN }));

app.use('/', express.static(path.join(__dirname, '../../client/dist')));

const server = new ApolloServer({
  typeDefs, resolvers, context: new GraphQLContext(BIG_QUERY_PROJECT)
});
server.applyMiddleware({ app });

const httpServer = createServer(app);

// Add a listener for our server on the correct ports
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
