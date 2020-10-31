import { gql } from 'apollo-server-express';

const postType = gql`
    type Post {
        _id: ID!
        title: String!
        description: String!
        createdBy: User!
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    # input type
    input PostCreateInput {
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
        postCreate(input: PostCreateInput!): Post!
    }
`;

export default postType;