import { AuthenticationError } from 'apollo-server-express';
import { IResolvers, IFieldResolver } from 'graphql-tools';
import { DateTimeResolver } from 'graphql-scalars';

import { PostDoc } from '../../models/post';
import { authCheck } from '../helpers/auth';
import { RequestResponseObject } from '../utils/context';
import PostService from '../../services/post.service';
import UserService from '../../services/user.service';

interface newPostArgs {
    input: {
        title: string;
        description: string;
    };
}

interface allPostsArgs {
    input: {
        pageNumber: number | undefined;
    }
}

// -- queries --

const allPosts: IFieldResolver<any, RequestResponseObject, allPostsArgs, Promise<PostDoc[]>> = async (parents, args, context) => {
    const userAuthRecord = await authCheck(context.req);

    if (!userAuthRecord) {
        throw new AuthenticationError('Unauthorized');
    }

    const currentPage = args.input.pageNumber || 1;

    const posts = await PostService.getAllPosts(currentPage);

    return posts;
}

const totalPosts: IFieldResolver<any, RequestResponseObject, any, Promise<number>> = async (parents, args, context) => {
    const userAuthRecord = await authCheck(context.req);

    if (!userAuthRecord) {
        throw new AuthenticationError('Unauthorized');
    }

    const postCount = await PostService.getPostCount();

    return postCount;
}

// -- mutations --

const postCreate: IFieldResolver<any, RequestResponseObject, newPostArgs, Promise<PostDoc>> = async (parent, args, context) => {
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

    return createdPost;
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
    }
};

export default postResolver;