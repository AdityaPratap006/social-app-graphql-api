import { IFieldResolver, IResolvers } from 'graphql-tools';
import chalk from 'chalk';
// import util from 'util';
import { DateTimeResolver } from 'graphql-scalars';

import { authCheck, getVerifiedUser } from '../helpers/auth';
import { RequestResponseObject } from '../utils/context';
import { UserDoc } from '../../models/user';
import UserService from '../../services/user.service';

interface userCreateArgs {
    input: {
        authToken: string;
    };
}

interface userUpdateArgs {
    input: {
        name: string;
        email: string;
        username: string;
        about: string;
        imageBase64String: string;
    };
}

const profile: IFieldResolver<any, RequestResponseObject, any, Promise<UserDoc>> = async (parent, args, context) => {
    const currentUser = await authCheck(context.req);

    const user = await UserService.getOneUserByEmail(currentUser.email as string);

    if (!user) {
        throw Error('User Profile not found');
    }

    return user;
}

const userCreate: IFieldResolver<any, RequestResponseObject, userCreateArgs, Promise<UserDoc>> = async (parent, args, { req }) => {
    // console.log(chalk.blueBright("args: ", util.inspect(args, { showHidden: false, depth: null })));

    const currentUser = await getVerifiedUser(args.input.authToken);
    const user = await UserService.getOneUserByEmail(currentUser.email as string);

    if (user) {
        console.log(chalk.blue('user already exists'));
        return user;
    }

    const newUser = await UserService.createNewUser({
        email: currentUser.email as string,
        name: currentUser.displayName as string,
    });

    return newUser;
};

const userUpdate: IFieldResolver<any, RequestResponseObject, userUpdateArgs, Promise<UserDoc | null>> = async (parent, args, { req }) => {
    // console.log(chalk.blueBright("args: ", util.inspect(args, { showHidden: false, depth: null })));

    const currentUser = await authCheck(req);

    const updatedUser = await UserService.getAndUpdateOneUser(currentUser.email as string, {
        ...args.input,
    });

    return updatedUser;
};

const allUsers: IFieldResolver<any, RequestResponseObject, any, Promise<UserDoc[]>> = async (parents, args, ctx) => {
    const users = await UserService.getAllUsers();

    return users;
}

const authResolver: IResolvers = {
    DateTime: DateTimeResolver,
    Query: {
        profile,
        allUsers,
    },
    Mutation: {
        userCreate,
        userUpdate,
    }
};

export default authResolver;