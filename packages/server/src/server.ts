#!/usr/bin/env node
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

const PORT = Number(process.env.PORT) || 4000;
const LISTEN_ADDR = process.env.LISTEN_ADDR || '0.0.0.0';
const BIG_QUERY_PROJECT = process.env.BIG_QUERY_PROJECT || 'bl-sice-edx-la-visualizations';
const CLIENT_BUILD = process.env.CLIENT_BUILD || '../../client/dist';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || null;
const USERS_FILE = process.env.USERS_FILE || '../../../raw-data/users.htpasswd';

function abspath(rawPath: string): string {
  if (rawPath.length && rawPath[0] === '.') {
    return path.resolve(path.join(__dirname, rawPath));
  } else {
    return path.resolve(rawPath);
  }
}

const app = express();

const basicAuth = auth.basic({
  realm: 'Learning Trajectories',
  file: abspath(USERS_FILE)
});
app.use(auth.connect(basicAuth));

app.use('*', cors({ origin: CLIENT_ORIGIN }));

app.use('/', express.static(abspath(CLIENT_BUILD)));

const server = new ApolloServer({
  typeDefs, resolvers, context: new GraphQLContext(BIG_QUERY_PROJECT)
});
server.applyMiddleware({ app });

const httpServer = createServer(app);

// Add a listener for our server on the correct ports
httpServer.listen(PORT, LISTEN_ADDR, 511, () => {
  console.log(`🚀 Server ready at http://${LISTEN_ADDR}:${PORT}`);
});
