import type { LinuxDesktopEnvironment } from "./LinuxDesktopEnvironment";

/**
 * A utility to resolve the current Linux desktop environment.
 */
export interface LinuxDesktopEnvironmentResolver {
    /**
     * Resolves the current Linux desktop environment.
     *
     * @returns The current Linux desktop environment or undefined if it could not be resolved.
     */
    resolve(): LinuxDesktopEnvironment | undefined;
}
