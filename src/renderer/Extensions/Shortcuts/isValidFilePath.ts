export const isValidFilePath = (filePath: string) => window.ContextBridge.fileExists(filePath);
