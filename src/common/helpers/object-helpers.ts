export function deepCopy<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

export function isEqual<T>(a: T, b: T): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}
