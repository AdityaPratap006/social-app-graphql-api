import { AuthenticationError } from 'apollo-server-express';
import { IResolvers, IFieldResolver } from 'graphql-tools';
import { DateTimeResolver } from 'graphql-scalars';

import { PostDoc } from '../../models/post';
import { authCheck } from '../helpers/auth';
import { ContextAttributes } from '../utils/context';
import PostService from '../../services/post.service';
import UserService from '../../services/user.service';
import { SubscriptionEvent } from '../utils/subscriptionEvents';

interface newPostArgs {
    input: {
        title: string;
        description: string;
    };
}

interface allPostsArgs {
    input: {
        skip: number | undefined;
    }
}

// -- queries --

const allPosts: IFieldResolver<any, ContextAttributes, allPostsArgs, Promise<PostDoc[]>> = async (parents, args, context) => {
    const userAuthRecord = await authCheck(context.req);

    if (!userAuthRecord) {
        throw new AuthenticationError('Unauthorized');
    }

    const skip = args.input.skip || 0;

    const posts = await PostService.getAllPosts(skip);

    return posts;
}

const totalPosts: IFieldResolver<any, ContextAttributes, any, Promise<number>> = async (parents, args, context) => {
    const userAuthRecord = await authCheck(context.req);

    if (!userAuthRecord) {
        throw new AuthenticationError('Unauthorized');
    }

    const postCount = await PostService.getPostCount();

    return postCount;
}

// -- mutations --

const postCreate: IFieldResolver<any, ContextAttributes, newPostArgs, Promise<PostDoc>> = async (parent, args, context) => {
    const { title, description } = args.input;

    if (!title.trim()) {
        throw Error('Title is required');
    }

    if (!description.trim()) {
        throw Error('Description is required');
    }

    const userAuthRecord = await authCheck(context.req);

    if (!userAuthRecord) {
        throw new AuthenticationError('Unauthorized');
    }

    const createdByUser = await UserService.getOneUserByEmail(userAuthRecord.email as string);

    if (!createdByUser) {
        throw new AuthenticationError('User not found');
    }

    const createdPost = await PostService.createPost({
        title: title,
        description: description,
        createdBy: createdByUser._id,
    });

    context.pubsub.publish(SubscriptionEvent.POST_ADDED, {
        onPostAdded: createdPost,
    });

    return createdPost;
}

// -- subscriptions --

const onPostAddedSubscribe: IFieldResolver<any, ContextAttributes, any, AsyncIterator<PostDoc, any, undefined>> = (parent, args, context) => {
    const { pubsub } = context;

    return pubsub.asyncIterator<PostDoc>([SubscriptionEvent.POST_ADDED]);
}

// resolver
const postResolver: IResolvers = {
    DateTime: DateTimeResolver,
    Query: {
        allPosts,
        totalPosts,
    },
    Mutation: {
        postCreate,
    },
    Subscription: {
        onPostAdded: {
            subscribe: onPostAddedSubscribe,
        },
    }
};

export default postResolver;