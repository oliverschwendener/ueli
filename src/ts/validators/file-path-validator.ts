export class WindowsFilePathValidator implements FilePathValidator {
    public isFilePath(filePath: string): boolean {
        // copy paste from https://www.regextester.com/96741
        let regex = new RegExp(/^[a-zA-Z]:\\[\\\S|*\S]?.*$/, "gi");
        return regex.test(filePath);
    }
}

export class MacOsFilePathValidator implements FilePathValidator {
    public isFilePath(filePath: string): boolean {
        // copy paste from https://stackoverflow.com/questions/6416065/c-sharp-regex-for-file-paths-e-g-c-test-test-exe/42036026#42036026
        let regex = new RegExp(/^\/$|(^(?=\/)|^\.|^\.\.)(\/(?=[^/\0])[^/\0]+)*\/?$/, "gi");
        return regex.test(filePath);
    }
}

export interface FilePathValidator {
    isFilePath(filePath: string): boolean;
}