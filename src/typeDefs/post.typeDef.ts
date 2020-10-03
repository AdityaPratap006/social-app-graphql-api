import { gql } from 'apollo-server-express';

const postType = gql`
    type Query {
        totalPosts: Int!
    }
`;

export default postType;