import { Request } from 'express';
import { PubSub } from 'apollo-server-express';

export interface ContextArgs {
    req: Request;
    pubsub: PubSub;
}

export const contextFunction = (args: ContextArgs) => args;