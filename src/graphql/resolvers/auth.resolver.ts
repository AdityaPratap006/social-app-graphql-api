import { IFieldResolver, IResolvers } from 'graphql-tools';
import shortid from 'shortid';
import { authCheck, getVerifiedUser } from '../helpers/auth';
import { RequestResponseObject } from '../utils/context';
import { User, UserDoc } from '../../models/user';
import chalk from 'chalk';
import util from 'util';

interface userCreateArgs {
    input: {
        authToken: string;
    };
}

const me: IFieldResolver<any, RequestResponseObject, userCreateArgs, Promise<string>> = async (parent, args, { req }) => {
    await authCheck(req);
    return 'John Wick';
};

const userCreate: IFieldResolver<any, RequestResponseObject, userCreateArgs, Promise<UserDoc>> = async (parent, args, { req }) => {
    console.log(chalk.blueBright("args: ", util.inspect(args, { showHidden: false, depth: null })));

    const currentUser = await getVerifiedUser(args.input.authToken);
    const user = await User.findOne({ email: currentUser.email });

    if (user) {
        console.log(chalk.blue('user already exists'));
        return user;
    }

    const newUser = User.build({
        email: currentUser.email as string,
        username: shortid.generate(),
        name: currentUser.displayName,
    });

    await newUser.save();
    console.log(chalk.green('created new user'));

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