import express, { Express, Request, Response } from 'express';
import { config as dotenvConfig } from 'dotenv';
import chalk from 'chalk';
import { ApolloServer } from 'apollo-server-express';
import http from 'http';
import { makeExecutableSchema } from 'graphql-tools';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import path from 'path'
import { GraphQLSchema } from 'graphql';
import mongoose from 'mongoose';
import cors from 'cors';
import { contextFunction } from './graphql/utils/context';

dotenvConfig();

const app: Express = express();

app.use(cors());

app.get('/rest', (_req: Request, res: Response) => {
    res.json({
        data: 'you hit a rest endpoint',
    });
});

const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, "./graphql/typeDefs")));

const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, "./graphql/resolvers")));

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
});


// graphql server
const apolloServer = new ApolloServer({
    schema: schema,
    context: contextFunction,
});

// connect apollo graphql server to a specific HTTP famework i.e: express
apolloServer.applyMiddleware({
    app: app,
    bodyParserConfig: {
        limit: '1mb',
    }
});

// create a general HTTP server
const PORT = process.env.PORT;

const httpServer = http.createServer(app);

// db
const connectToDatabase = async () => {
    try {
        const dbURL = process.env.MONGODB_DATABASE_URL as string;
        await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log(chalk.greenBright(`\nConnected to MongoDB successfully!`));
    } catch (error) {
        console.log(chalk.red(`\nError connecting to mongodb: ${error.message}`));
    }
}

httpServer.listen(PORT, async () => {

    console.log(chalk.yellow('\n\nConnecting to DB\n'));

    await connectToDatabase();

    const localURL = `http://localhost:${PORT}`;
    console.log(`\nServer is ready at ${chalk.blueBright(localURL)}`);

    const graphqlURL = `${localURL}${apolloServer.graphqlPath}`;
    console.log(`GraphQL Server is ready at ${chalk.magentaBright(graphqlURL)}\n`);
});