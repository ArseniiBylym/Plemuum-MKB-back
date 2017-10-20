interface FirebaseConfig {
    projectId: string,
    keyFileName: string,
    bucketName: string,
    baseUrl: string;
    databaseUrl: string;
}

const getDefaultFirebaseConfig = () => ({
    projectId: 'plenuumbackend',
    keyFileName: 'PlenuumBackend-25b19e804e20.json',
    bucketName: 'plenuumbackend.appspot.com',
    baseUrl: 'http://storage.googleapis.com/plenuumbackend.appspot.com/',
    databaseUrl: 'https://plenuumbackend.firebaseio.com/'
});

export default FirebaseConfig
export { getDefaultFirebaseConfig }