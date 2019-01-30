export interface WebSearch {
    name: string;
    prefix: string;
    url: string;
    icon: string;
    priority: number;
    isFallback: boolean;
    whitespaceCharacter?: string;
    encodeSearchTerm: boolean;
}
