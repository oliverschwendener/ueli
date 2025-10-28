/**
 * Resolve application icon file path based on OS and theme.
 *
 * Scope: generic, not BrowserWindow-specific.
 * - Use this contract from non-BrowserWindow subsystems (e.g., Notification).
 * - In BrowserWindow code, depend on `BrowserWindowAppIconFilePathResolver`
 *   to keep that subsystem decoupled and easy to mock.
 */
export interface AppIconFilePathResolver {
    getAppIconFilePath(): string;
}
