import firebaseAdmin, { ServiceAccount } from 'firebase-admin';
import chalk from 'chalk';
import { Request } from 'express';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const serviceAccountParams = <ServiceAccount>{
    type: process.env.FIREBASE_type,
    projectId: process.env.FIREBASE_projectId,
    privateKeyId: process.env.FIREBASE_privateKeyId,
    privateKey: process.env.FIREBASE_privateKey?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_clientEmail,
    clientId: process.env.FIREBASE_clientId,
    authUri: process.env.FIREBASE_authUri,
    tokenUri: process.env.FIREBASE_tokenUri,
    authProviderX509CertUrl: process.env.FIREBASE_authProviderX509CertUrl,
    clientC509CertUrl: process.env.FIREBASE_clientC509CertUrl
};

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccountParams),
});

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
