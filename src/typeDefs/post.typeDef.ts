import { gql } from 'apollo-server-express';

const postType = gql`
    type Post {
        id: ID!
        title: String!
        description: String!
    }

    # queries
    type Query {
        totalPosts: Int!
        allPosts: [Post!]!
    }

    # mutations 
    type Mutation {
        newPost(title: String!, description: String!): Post!
    }
`;

export default postType;