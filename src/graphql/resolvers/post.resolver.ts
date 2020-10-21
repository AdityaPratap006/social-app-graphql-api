import { IResolvers, IFieldResolver } from 'graphql-tools';
import chalk from 'chalk';
import util from 'util';
import { IPost } from '../../models';
import { posts } from '../../data';
import { authCheck } from '../helpers/auth';
import { RequestResponseObject } from '../utils/context';

interface newPostArgs {
    input: {
        title: string;
        description: string;
    };
}

// -- queries --

const totalPosts: IFieldResolver<any, RequestResponseObject, any, Promise<number>> = async (parents, args, context) => {
    await authCheck(context.req);

    return posts.length
};

const allPosts: IFieldResolver<any, RequestResponseObject, any, Promise<IPost[]>> = async (parents, args, context) => {
    await authCheck(context.req);
    return posts;
}

// -- mutations --

const newPost: IFieldResolver<any, RequestResponseObject, newPostArgs, Promise<IPost>> = async (parent, args, context) => {

    await authCheck(context.req);

    const post: IPost = {
        id: posts.length + 1,
        ...args.input,
    }

    posts.push(post);

    return post;
}

// resolver
const postResolver: IResolvers = {
    Query: {
        totalPosts,
        allPosts,
    },
    Mutation: {
        newPost,
    }
};

export default postResolver;