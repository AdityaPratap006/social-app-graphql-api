const totalPosts = () => 42;

const postResolver = {
    Query: {
        totalPosts,
    }
};

export default postResolver;