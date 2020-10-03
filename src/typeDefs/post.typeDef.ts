import { gql } from 'apollo-server-express';

const postType = gql`
    type Post {
        id: ID!
        title: String!
        description: String!
    }

    type Query {
        totalPosts: Int!
        allPosts: [Post!]!
    }
`;

export default postType;