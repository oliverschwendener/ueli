export class CalculatorHelper {
    public static getExecutionArgumentPrefix = "calculator-result:";

    public static getExecutionArgument(result: string): string {
        return `${this.getExecutionArgumentPrefix} ${result}`;
    }

    public static getBlackListInputs(): string[] {
        return [
            "version",
            "i",
        ];
    }
}
