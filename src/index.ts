import express, { Express, Request, Response } from 'express';
import { config as dotenvConfig } from 'dotenv';
import chalk from 'chalk';
import { ApolloServer, gql, IResolvers } from 'apollo-server-express';
import http from 'http';

dotenvConfig();

const app: Express = express();

app.get('/rest', (_req: Request, res: Response) => {
    res.json({
        data: 'you hit a rest endpoint',
    });
});

// types query / mutation / subscription
const typeDefs = gql`
    type Query {
        totalPosts: Int!
    }
`;

// resolvers
const resolvers: IResolvers<any, any> = {
    Query: {
        totalPosts: () => 42,
    }
};

// graphql server
const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
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