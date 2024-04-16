import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { CommandShortcutInvoker } from "./CommandShortcutInvoker";
import { FileShortcutInvoker } from "./FileShortcutInvoker";
import { ShortcutActionHandler } from "./ShortcutActionHandler";
import { Shortcuts } from "./Shortcuts";
import { UrlShortcutInvoker } from "./UrlShortcutInvoker";

export class ShortcutsModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new Shortcuts(
                dependencyRegistry.get("SettingsManager"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("UrlImageGenerator"),
                dependencyRegistry.get("FileImageGenerator"),
                dependencyRegistry.get("Logger"),
            ),
            actionHandlers: [
                new ShortcutActionHandler({
                    File: new FileShortcutInvoker(dependencyRegistry.get("Shell")),
                    Url: new UrlShortcutInvoker(dependencyRegistry.get("Shell")),
                    Command: new CommandShortcutInvoker(dependencyRegistry.get("CommandlineUtility")),
                }),
            ],
        };
    }
}
