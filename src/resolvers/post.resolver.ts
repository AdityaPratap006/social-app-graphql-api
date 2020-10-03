import { IPost } from '../models';
import { posts } from '../data';
import chalk from 'chalk';
import util from 'util';

interface newPostArgs {
    input: {
        title: string;
        description: string;
    };
}

// -- queries --

const totalPosts = () => posts.length;

const allPosts = () => {
    return posts;
}

// -- mutations --

const newPost = (parent: any, args: newPostArgs) => {
    console.log(chalk.blueBright("args: ", util.inspect(args, { showHidden: false, depth: null })));

    const post: IPost = {
        id: posts.length + 1,
        ...args.input,
    }

    posts.push(post);

    return post;
}

// resolver
const postResolver = {
    Query: {
        totalPosts,
        allPosts,
    },
    Mutation: {
        newPost,
    }
};

export default postResolver;