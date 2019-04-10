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

    public static isValidEmailAddress(emailAddress: string): boolean {
        return new RegExp(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)).test(emailAddress);
    }
}
