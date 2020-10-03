const me = () => 'John Wick';

const authResolver = {
    Query: {
        me,
    }
};

export default authResolver;