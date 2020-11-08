import { Request } from 'express';
import { PubSubEngine } from 'apollo-server-express';

interface ContextExternalArgs {
    pubsub: PubSubEngine;
}

export interface ContextArgs {
    req: Request;
}

export type ContextAttributes = ContextArgs & ContextExternalArgs;

type ContextFunctionInner = (args: ContextArgs) => ContextAttributes;

export const contextFunction = ({ pubsub }: ContextExternalArgs): ContextFunctionInner => {
    return (args) => ({
        ...args,
        pubsub
    });
};