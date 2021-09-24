import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createSchema } from './utils/createSchema';
import next from 'next';
import { parse } from 'url';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

const dev = process.env.NODE_ENV !== 'production';
const rootDir = process.env.NODE_ENV === 'development' ? 'server' : 'dist';

const main = async () => {
  dotenv.config({ path: path.join(__dirname, '../.env.local') });

  const app = next({ dev });
  const handle = app.getRequestHandler();
  await app.prepare();

  const server = express();

  server.all(/^((?!\/api\/).)*$/, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const httpServer = http.createServer(server);

  try {
    const entitiesPath = path.join(
      __dirname,
      `../${rootDir}/entities/**/*{.ts,.js}`
    );

    console.log(entitiesPath);

    await createConnection({
      type: 'mongodb',
      url: process.env.MONGODB_URI!,
      entities: [entitiesPath]
    });
    console.log('mongodb connected');
  } catch (error) {
    console.log(error);
  }

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app: server, path: '/api/graphql' });

  await new Promise((resolve) =>
    httpServer.listen({ port: 3000 }, resolve as any)
  );
  console.log(`🚀 Server ready at http://localhost:3000`);
};

main();
