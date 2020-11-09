import { Request } from 'express';
import { config as dotenvConfig } from 'dotenv';
import { firebaseAdmin } from '../../utils/firebase-admin';

dotenvConfig();


const getUserDetails = async (uid: string) => {
    try {
        const currentUser = await firebaseAdmin.auth().getUser(uid);
        return currentUser;
    } catch (error) {
        throw error;
    }
}

export const getVerifiedUser = async (authToken: string) => {
    try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(authToken);
        const currentUser = await getUserDetails(decodedToken.uid);

        return currentUser;
    } catch (error) {
        throw Error(`Invalid or expired token`);
    }
}

export const authCheck = async (req: Request) => {
    const authToken = req.headers.authorization || '';
    const currentUser = await getVerifiedUser(authToken);
    return currentUser;
}
