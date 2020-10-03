import { IPost } from '../models';
import { posts } from '../data';
// import chalk from 'chalk';
// import util from 'util';

interface newPostArgs {
    title: string;
    description: string;
}

// -- queries --

const totalPosts = () => posts.length;

const allPosts = () => {
    return posts;
}

// -- mutations --

const newPost = (parent: any, args: newPostArgs) => {
    // console.log(chalk.blueBright("args: ", util.inspect(args, { showHidden: false, depth: null })));

    const { title, description } = args;

    const post: IPost = {
        id: posts.length + 1,
        title,
        description,
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