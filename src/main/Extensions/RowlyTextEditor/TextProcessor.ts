export interface TextProcessor {
    process(input: string, pattern: string, rowSeparator: string, columnSeparator: string): string;
}
