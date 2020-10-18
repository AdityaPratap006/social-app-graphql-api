import { IFieldResolver, IResolvers } from 'graphql-tools';
import shortid from 'shortid';
import { authCheck } from '../helpers/auth';
import { RequestResponseObject } from '../utils/context';
import { User, UserDoc } from '../../models/user';

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

const userCreate: IFieldResolver<any, RequestResponseObject, any, Promise<UserDoc>> = async (parent, args, { req }) => {
    const currentUser = await authCheck(req);
    const user = await User.findOne({ email: currentUser.email });

    if (user) {
        return user;
    }

    const newUser = User.build({
        email: currentUser.email as string,
        username: shortid.generate(),
        name: currentUser.displayName,
    });

    await newUser.save();
    return newUser;
};

const authResolver: IResolvers = {
    Query: {
        me,
    },
    Mutation: {
        userCreate,
    }
};

export default authResolver;