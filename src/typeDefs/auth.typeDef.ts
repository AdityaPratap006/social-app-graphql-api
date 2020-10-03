import { gql } from 'apollo-server-express';

const authType = gql`
    type Query {
        me: String!
    }
`;

export default authType;