import {
  AppOptions,
  cert,
  getApp,
  getApps,
  initializeApp,
  ServiceAccount,
} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseAdminConfig } from './firebase-admin.config';

const serviceAccount = firebaseAdminConfig as ServiceAccount;

const options: AppOptions = {
  credential: cert(serviceAccount),
  databaseURL: process.env.databaseURL,
};

function createFirebaseAdminApp(config: AppOptions) {
  if (getApps().length === 0) {
    return initializeApp(config);
  } else {
    return getApp();
  }
}

const firebaseAdmin = createFirebaseAdminApp(options);

export const db = getFirestore(firebaseAdmin);
