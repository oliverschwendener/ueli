declare module "node-osascript" {
    export function execute(command: string, variables: any, callback: (err: any, result: any, raw: any) => void): void;
}