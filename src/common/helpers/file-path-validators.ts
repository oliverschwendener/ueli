export function isValidWindowsFilePath(filePath: string): boolean {
    return /^[a-zA-Z]:\\[\\\S|*\S]?.*$/.test(filePath);
}

export function isValidMacOsFilePath(filePath: string): boolean {
    return /^\/$|(^(?=\/)|^\.|^\.\.)(\/(?=[^/\0])[^/\0]+)*\/?$/.test(filePath);
}
