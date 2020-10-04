import { IResolvers, IFieldResolver } from 'graphql-tools';
import chalk from 'chalk';
import util from 'util';
import { IPost } from '../../models';
import { posts } from '../../data';


interface newPostArgs {
    input: {
        title: string;
        description: string;
    };
}

// -- queries --

const totalPosts: IFieldResolver<any, any, any, number> = () => posts.length;

const allPosts: IFieldResolver<any, any, any, IPost[]> = () => {
    return posts;
}

// -- mutations --

const newPost: IFieldResolver<any, any, newPostArgs, IPost> = (parent, args, context) => {
    console.log(chalk.blueBright("args: ", util.inspect(args, { showHidden: false, depth: null })));

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