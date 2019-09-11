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

    public static replaceWhitespace(original: string, replaceWith: string): string {
        return original.replace(/\s/g, replaceWith);
    }

    public static stringIsWhiteSpace(value: string): boolean {
        return value === undefined
            || value.trim().length === 0;
    }
}
