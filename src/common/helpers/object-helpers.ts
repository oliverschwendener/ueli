export function deepCopy<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

export function isEqual(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}
