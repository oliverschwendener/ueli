export class FilePathRegex {
    public static readonly windowsFilePathRegExp = /^[a-zA-Z]:\\[\\\S|*\S]?.*$/;
    public static readonly macOsFilePathRegexp = /^\/$|(^(?=\/)|^\.|^\.\.)(\/(?=[^/\0])[^/\0]+)*\/?$/;
}
