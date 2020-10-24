import { gql } from 'apollo-server-express';

const authType = gql`
    type Query {
        me: String!
    }

    type Image {
        url: String
        public_id: String
    }

    type User {
        _id: ID!
        username: String
        email: String
        name: String
        about: String
        images: [Image]
        createdAt: String
        updatedAt: String
    }

    input AuthTokenInput {
        authToken: String!
    }

    type UserCreateResponse {
        username: String!
        email: String!
    }

    input ImageInput {
        url: String!
        public_id: String!
    }

    input UserUpdateInput {
        username: String
        email: String
        name: String
        images: [ImageInput]
        about: String
    }

    type Mutation {
        userCreate(input: AuthTokenInput!): UserCreateResponse!
        userUpdate(input: UserUpdateInput): User!
    }
`;

export default authType;