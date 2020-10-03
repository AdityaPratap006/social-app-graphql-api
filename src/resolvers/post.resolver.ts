import { posts } from '../data';

const totalPosts = () => posts.length;

const allPosts = () => {
    return posts;
}

const postResolver = {
    Query: {
        totalPosts,
        allPosts,
    }
};

export default postResolver;