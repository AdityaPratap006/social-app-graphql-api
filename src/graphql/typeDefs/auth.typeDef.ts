import { gql } from 'apollo-server-express';

const authType = gql`
    scalar DateTime

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
        createdAt: DateTime
        updatedAt: DateTime
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
        imageBase64String: String
        about: String
    }

    type Mutation {
        userCreate(input: AuthTokenInput!): UserCreateResponse!
        userUpdate(input: UserUpdateInput): User!
    }

    type Query {
        profile: User!
    }
`;

export default authType;