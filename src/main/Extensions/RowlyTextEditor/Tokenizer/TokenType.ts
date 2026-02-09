export type TokenType =
    | { type: "column"; index: number }
    | { type: "literal"; value: string }
    | { type: "function"; name: string; params: TokenType[][] };
