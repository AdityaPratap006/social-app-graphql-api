import firebaseAdmin, { ServiceAccount } from 'firebase-admin';
import chalk from 'chalk';
import { Request } from 'express';
import { config as dotenvConfig } from 'dotenv';
import serviceAccount from '../../config/firebaseServiceAccountKey.json';

dotenvConfig();

const serviceAccountParams = <ServiceAccount>{
    type: process.env.FIREBASE_type || serviceAccount.type,
    projectId: process.env.FIREBASE_projectId || serviceAccount.project_id,
    privateKeyId: process.env.FIREBASE_privateKeyId || serviceAccount.private_key_id,
    privateKey: process.env.FIREBASE_privateKey?.replace(/\\n/g, '\n') || serviceAccount.private_key,
    clientEmail: process.env.FIREBASE_clientEmail || serviceAccount.client_email,
    clientId: process.env.FIREBASE_clientId || serviceAccount.client_id,
    authUri: process.env.FIREBASE_authUri || serviceAccount.auth_uri,
    tokenUri: process.env.FIREBASE_tokenUri || serviceAccount.token_uri,
    authProviderX509CertUrl: process.env.FIREBASE_authProviderX509CertUrl || serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: process.env.FIREBASE_clientC509CertUrl || serviceAccount.client_x509_cert_url
};

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccountParams),
});

const getUserDetails = async (uid: string) => {
    try {
        const currentUser = await firebaseAdmin.auth().getUser(uid);
        return currentUser;
    } catch (error) {
        console.log(chalk.red('USER NOT FOUND: ', error));
        throw Error(`User not found`);
    }
}

export const getVerifiedUser = async (authToken: string) => {
    try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(authToken);
        const currentUser = await getUserDetails(decodedToken.uid);

        return currentUser;
    } catch (error) {
        console.log(chalk.red('AUTH CHECK ERROR', error));
        if (error = `User not found`) {
            throw Error(error);
        }
        throw Error(`Invalid or expired token`);
    }
}

export const authCheck = async (req: Request) => {
    const authToken = req.headers.authorization || '';
    const currentUser = await getVerifiedUser(authToken);
    return currentUser;
}
