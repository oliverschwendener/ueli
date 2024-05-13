/**
 * Offers methods to get the current date.
 */
export interface DateProvider {
    /**
     * Gets the current date.
     */
    get(): Date;
}
