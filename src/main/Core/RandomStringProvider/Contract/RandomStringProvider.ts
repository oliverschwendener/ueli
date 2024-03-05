/**
 * Offers a method to generate a random string.
 */
export interface RandomStringProvider {
    /**
     * Generates a random string which is cryptographically secure.
     */
    getRandomUUid(): string;
}
