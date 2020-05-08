export interface CalculatorOptions {
    precision: number;
    isEnabled: boolean;
    separator: string;
}

export const defaultCalculatorOptions: CalculatorOptions = {
    isEnabled: true,
    precision: 16,
    separator: ",",
};
