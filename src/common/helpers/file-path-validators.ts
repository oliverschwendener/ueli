import { win32 } from "path";

export function isValidWindowsFilePath(filePath: string): boolean {
    filePath = win32.normalize(filePath);
    return /^(([a-zA-Z]:\\)|(\\{2}))[\\\S|*\S]?.*$/.test(filePath);
}

export function isValidMacOsFilePath(filePath: string): boolean {
    return /^\/$|(^(?=\/)|^\.|^\.\.)(\/(?=[^/\0])[^/\0]+)*\/?$/.test(filePath);
}
