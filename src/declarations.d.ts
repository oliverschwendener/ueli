// Typescript type declarations

declare module "simple-plist" {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function readFile(filePath: string, callback: (err: string, data: any) => void): void;
}
