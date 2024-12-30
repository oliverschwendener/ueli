import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { TaskScheduler } from "./TaskScheduler";

export class TaskSchedulerModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry): void {
        moduleRegistry.register("TaskScheduler", new TaskScheduler());
    }
}
