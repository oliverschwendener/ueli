export interface CalculatorOptions {
    precision: number;
    decimalSeparator: string;
    argumentSeparator: string;
    isEnabled: boolean;
}

export const defaultCalculatorOptions: CalculatorOptions = {
    isEnabled: true,
    precision: 16,
    decimalSeparator: ".",
    argumentSeparator: ","
};
