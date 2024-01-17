import type { ActionHandler } from "@Core/ActionHandler";
import type { Extension } from "@Core/Extension";

export type ExtensionBootstrapResult = {
    extension: Extension;
    actionHandlers?: ActionHandler[];
};
