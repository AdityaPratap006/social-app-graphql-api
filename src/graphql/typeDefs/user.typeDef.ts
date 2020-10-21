import { gql } from 'apollo-server-express';

const userType = gql`
    input AuthTokenInput {
        authToken: String!
    }

    type UserCreateResponse {
        username: String!
        email: String!
    }

    type Mutation {
        userCreate(input: AuthTokenInput!): UserCreateResponse!
    }
`;

export default userType;