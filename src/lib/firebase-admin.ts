import {
  AppOptions,
  cert,
  getApp,
  getApps,
  initializeApp,
  ServiceAccount,
} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// How to obtain required credentials
// https://firebase.google.com/docs/admin/setup#initialize-sdk

const credentials: ServiceAccount = {
  projectId: process.env.PROJECT_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.CLIENT_EMAIL,
};

const options: AppOptions = {
  credential: cert(credentials),
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
