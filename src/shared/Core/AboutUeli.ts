/**
 * Represents the information shown on the "About" page.
 */
export type AboutUeli = {
    /**
     * The current Electron version
     */
    electronVersion: string;

    /**
     * The current Node.js version
     */
    nodeJsVersion: string;

    /**
     * The current V8 version bundled with Electron
     */
    v8Version: string;

    /**
     * The current Ueli version
     */
    version: string;
};
