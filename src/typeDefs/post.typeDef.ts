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

    # input type
    input PostInput {
        title: String!
        description: String!
    }

    # mutations 
    type Mutation {
        newPost(input: PostInput!): Post!
    }
`;

export default postType;