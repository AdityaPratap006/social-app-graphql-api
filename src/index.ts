import express, { Express, Request, Response } from 'express';
import { config as dotenvConfig } from 'dotenv';
import chalk from 'chalk';
import { ApolloServer, gql, IResolvers } from 'apollo-server-express';
import http from 'http';
import { makeExecutableSchema } from 'graphql-tools';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import path from 'path'
import { GraphQLSchema } from 'graphql';

dotenvConfig();

const app: Express = express();

app.get('/rest', (_req: Request, res: Response) => {
    res.json({
        data: 'you hit a rest endpoint',
    });
});

// types query / mutation / subscription
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, "./typeDefs")));

// resolvers
const resolvers: IResolvers<any, any> = {
    Query: {
        totalPosts: () => 42,
        me: () => 'John Wick',
    }
};

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
})

// graphql server
const apolloServer = new ApolloServer({
    schema: schema
});

// connect apollo server to a specific HTTP famework i.e: express
apolloServer.applyMiddleware({
    app: app,
});

const httpServer = http.createServer(app);

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
    const localURL = `http://localhost:${PORT}`;
    console.log(`Server is ready at ${chalk.blueBright(localURL)}`);

    const graphqlURL = `${localURL}${apolloServer.graphqlPath}`;
    console.log(`GraphQL Server is ready at ${chalk.magentaBright(graphqlURL)}`);
});