import { gql } from 'apollo-server-express';

const userType = gql`
    type UserCreateResponse {
        username: String!
        email: String!
    }

    type Mutation {
        userCreate: UserCreateResponse!
    }
`;

export default userType;