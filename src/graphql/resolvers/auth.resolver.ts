import { IFieldResolver } from 'graphql-tools';
import { authCheck } from '../helpers/auth';
import { RequestResponseObject } from '../utils/context';

interface newPostArgs {
    input: {
        title: string;
        description: string;
    };
}

const me: IFieldResolver<any, RequestResponseObject, newPostArgs, Promise<string>> = async (parent, args, { req }) => {
    await authCheck(req);
    return 'John Wick';
};

const authResolver = {
    Query: {
        me,
    }
};

export default authResolver;