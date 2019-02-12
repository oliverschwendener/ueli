export class StringHelpers {
    public static capitalize(value: string): string {
        if (value === undefined) {
            return "";
        }

        if (value.length === 0) {
            return "";
        }

        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}
