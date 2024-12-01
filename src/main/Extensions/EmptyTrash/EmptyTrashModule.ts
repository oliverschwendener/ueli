import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { EmptyTrash } from "./EmptyTrash";
import { EmptyTrashActionHandler } from "./EmptyTrashActionHandler";
import { EmptyTrashExtension } from "./EmptyTrashExtension";

export class EmptyTrashModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new EmptyTrashExtension(dependencyRegistry.get("AssetPathResolver")),
            actionHandlers: [
                new EmptyTrashActionHandler(
                    new EmptyTrash(
                        dependencyRegistry.get("CommandlineUtility"),
                        dependencyRegistry.get("PowershellUtility"),
                        dependencyRegistry.get("OperatingSystem"),
                    ),
                ),
            ],
        };
    }
}
