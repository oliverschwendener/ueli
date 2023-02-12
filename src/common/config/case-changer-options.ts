export interface CaseChangerOptions {
    isEnabled: boolean;
    prefix: string;
}

export const defaultCaseChangerOptions: CaseChangerOptions = {
    isEnabled: false,
    prefix: "case?",
};
