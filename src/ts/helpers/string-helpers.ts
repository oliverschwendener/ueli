export class StringHelpers {
    public static replaceWhiteSpace(value: string): string {
        return value.replace(/\s/g, "");
    }

    public static stringIsWhiteSpace(value: string): boolean {
        return StringHelpers.replaceWhiteSpace(value).length === 0;
    }

    public static trimAndReplaceMultipleWhiteSpacesWithOne(value: string): string {
        return value.replace(/\s\s+/g, " ").trim();
    }
}