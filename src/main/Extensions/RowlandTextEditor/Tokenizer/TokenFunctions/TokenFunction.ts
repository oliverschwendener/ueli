export interface TokenFunction {
    name: string;
    evaluate(params: string[], columns: string[]): string;
}
