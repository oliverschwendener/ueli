
export interface ProcessKillerOptions {
    isEnabled: boolean;
    prefix: string;
}


export const defaultProcessKillerOptions: ProcessKillerOptions = {
    isEnabled: true,
    prefix: "kill?",
};

