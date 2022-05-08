export interface ApplicationNativeNameCaches {
    [filePath: string]: ApplicationNativeNameCache;
}

export interface ApplicationNativeNameCache {
    nativeName?: string;
    keyword?: string[];
}
