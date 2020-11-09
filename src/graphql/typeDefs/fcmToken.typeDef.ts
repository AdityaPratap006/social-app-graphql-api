import { gql } from 'apollo-server-express';

const fcmTokenType = gql`

    type SaveFcmTokenResponse {
        message: String
    }

    # input type
    input SaveFcmTokenInput {
        fcmToken: String
    }

    # mutations 
    type Mutation {
        saveFcmToken(input: SaveFcmTokenInput!):  SaveFcmTokenResponse!
    }
`;

export default fcmTokenType;