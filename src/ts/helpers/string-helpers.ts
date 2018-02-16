export class StringHelpers {
    public static removeWhiteSpace(value: string): string {
        return value.replace(/\s/g, "");
    }

    public static stringIsWhiteSpace(value: string): boolean {
        return StringHelpers.removeWhiteSpace(value).length === 0;
    }

    public static trimAndReplaceMultipleWhiteSpacesWithOne(value: string): string {
        return value.replace(/\s\s+/g, " ").trim();
    }
}