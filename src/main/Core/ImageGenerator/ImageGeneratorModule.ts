import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { UrlImageGenerator } from "./UrlImageGenerator";

export class ImageGeneratorModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        dependencyRegistry.register(
            "UrlImageGenerator",
            new UrlImageGenerator(dependencyRegistry.get("SettingsManager")),
        );
    }
}
