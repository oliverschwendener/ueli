export function capitalize(value: string): string {
    if (value === undefined) {
        return "";
    }

    if (value.length === 0) {
        return "";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function replaceWhitespace(original: string, replaceWith: string): string {
    return original.replace(/\s/g, replaceWith);
}

export function stringIsWhiteSpace(value: string): boolean {
    return value === undefined || value.trim().length === 0;
}

export function unique(values: string[]): string[] {
    const result: string[] = [];

    values.forEach((value) => {
        if (result.indexOf(value) === -1) {
            result.push(value);
        }
    });

    return result;
}
