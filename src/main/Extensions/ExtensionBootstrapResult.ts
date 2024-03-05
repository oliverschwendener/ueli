import type { ActionHandler } from "@Core/ActionHandler";
import type { Extension } from "@Core/Extension";

/**
 * Represents the result of bootstrapping an extension.
 */
export type ExtensionBootstrapResult = {
    /**
     * The extension.
     *
     * If you're building an extension, you need to provide an instance of your extension here.
     */
    extension: Extension;

    /**
     * Custom action handlers for the extension.
     *
     * If your extension need a custom action handlers, you can specify them here.
     */
    actionHandlers?: ActionHandler[];
};
