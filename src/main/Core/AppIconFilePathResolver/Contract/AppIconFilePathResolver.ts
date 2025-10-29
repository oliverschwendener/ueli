/**
 * Resolve application icon file path based on OS and theme.
 */
export interface AppIconFilePathResolver {
    resolve(): string;
}
