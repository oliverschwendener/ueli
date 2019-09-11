export interface CalculatorOptions {
    precision: number;
    isEnabled: boolean;
}

export const defaultCalculatorOptions: CalculatorOptions = {
    isEnabled: true,
    precision: 16,
};
