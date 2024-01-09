import { DependencyInjector as DependencyInjectorInterface } from "./Contract";
import { DependencyInjector } from "./DependencyInjector";

export class DependencyInjectorModule {
    public static bootstrap(): DependencyInjectorInterface {
        return new DependencyInjector();
    }
}
