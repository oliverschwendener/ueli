// Typescript type declarations

declare module "simple-plist" {
    export function readFile(filePath: string, callback: (err: string, data: any) => void): void;
}
