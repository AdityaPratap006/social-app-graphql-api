import { IFieldResolver, IResolvers } from 'graphql-tools';
// import chalk from 'chalk';
// import util from 'util';
import { authCheck } from '../helpers/auth';
import { ContextAttributes } from '../utils/context';
import UserService from '../../services/user.service';

interface SaveFcmTokenArgs {
    input: {
        fcmToken: string;
    };
}

const saveFcmToken: IFieldResolver<any, ContextAttributes, SaveFcmTokenArgs, Promise<{ message: string }>> = async (parent, args, context) => {
    const userAuthRecord = await authCheck(context.req);

    const user = await UserService.saveFcmTokenForUser(userAuthRecord.email as string, args.input.fcmToken);

    return {
        message: `FCM Token saved for User: ${user.email}`,
    };
}

const fcmTokenResolver: IResolvers = {
    Mutation: {
        saveFcmToken,
    }
};

export default fcmTokenResolver;