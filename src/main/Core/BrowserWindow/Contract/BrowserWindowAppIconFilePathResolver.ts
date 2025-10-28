/**
 * Minimal adapter contract for the BrowserWindow subsystem.
 *
 * BrowserWindow code should depend on this interface, not on
 * `AppIconFilePathResolver`. This keeps the subsystem decoupled and
 * testable. The actual implementation is bound in `BrowserWindowModule`
 * (currently to the generic `AppIconFilePathResolver`).
 */
export interface BrowserWindowAppIconFilePathResolver {
    getAppIconFilePath(): string;
}
