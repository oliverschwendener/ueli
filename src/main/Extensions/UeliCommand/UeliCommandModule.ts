import type { DependencyInjector } from "../../DependencyInjector";
import type { UeliCommandInvoker } from "../../UeliCommand";
import { UeliCommandActionHandler } from "./UeliCommandActionHandler";
import { UeliCommandExtension } from "./UeliCommandExtension";

export class UeliCommandModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const ueliCommandInvoker = dependencyInjector.getInstance<UeliCommandInvoker>("UeliCommandInvoker");

        dependencyInjector.registerExtension(new UeliCommandExtension());
        dependencyInjector.registerActionHandler(new UeliCommandActionHandler(ueliCommandInvoker));
    }
}
