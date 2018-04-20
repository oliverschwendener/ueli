export class NoWebSearchErrorFoundError extends Error {
    constructor(userInput: string) {
        super(`No valid web search found for ${userInput}`);
    }
}
