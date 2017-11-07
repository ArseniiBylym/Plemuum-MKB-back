interface FirebaseConfig {
    projectId: string,
    keyFileName: string,
    bucketName: string,
    baseUrl: string;
    databaseUrl: string;
}

const getDefaultFirebaseConfig = (): FirebaseConfig => ({
    projectId: 'plenuumbackend',
    keyFileName: 'firebase-staging.json',
    bucketName: 'plenuumbackend.appspot.com',
    baseUrl: 'http://storage.googleapis.com/plenuumbackend.appspot.com/',
    databaseUrl: 'https://plenuumbackend.firebaseio.com/'
});

const getProductionFirebaseConfig = (): FirebaseConfig => ({
    projectId: 'plenuumbackend-production',
    keyFileName: 'firebase-production.json',
    bucketName: 'plenuumbackend-production.appspot.com',
    baseUrl: 'http://storage.googleapis.com/plenuumbackend-production.appspot.com/',
    databaseUrl: 'https://plenuumbackend-production.firebaseio.com/'
});

export default FirebaseConfig
export { getDefaultFirebaseConfig, getProductionFirebaseConfig }