export interface RandomStringProvider {
    getRandomHexString(byteLength: number): string;
}
