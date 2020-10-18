import firebaseAdmin, { ServiceAccount } from 'firebase-admin';
import chalk from 'chalk';
import util from 'util';
import { Request, Response, NextFunction } from 'express';
import serviceAccount from '../../config/firebaseServiceAccountKey.json';

const serviceAccountParams = <ServiceAccount>{
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url
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

export const authCheck = async (req: Request) => {

    try {
        const authToken = req.headers.authorization || '';

        const decodedToken = await firebaseAdmin.auth().verifyIdToken(authToken);
        const currentUser = await getUserDetails(decodedToken.uid);

        console.log(chalk.magenta('CURRENT USER: ', util.inspect(currentUser, { showHidden: false, depth: null })));

        return currentUser;
    } catch (error) {
        console.log(chalk.red('AUTH CHECK ERROR', error));
        if (error = `User not found`) {
            throw Error(error);
        }
        throw Error(`Invalid or expired token`);
    }
}