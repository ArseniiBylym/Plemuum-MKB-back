interface StorageManager {
    uploadFile(destination: string, fileName: string, filePath: string): Promise<string>;
}

export default StorageManager;