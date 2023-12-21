import type { DependencyInjector } from "../DependencyInjector";
import { ConsoleLogWriter } from "./ConsoleLogWriter";
import type { Logger as LoggerInterface } from "./Contract";
import { Logger } from "./Logger";

export class LoggerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerInstance<LoggerInterface>("Logger", new Logger([new ConsoleLogWriter()]));
    }
}
