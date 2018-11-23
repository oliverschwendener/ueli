// Typescript type declarations

declare module "app2png" {
    export function convert(filePath: string, destination: string): Promise<void>;
}