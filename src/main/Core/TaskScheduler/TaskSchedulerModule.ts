import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { TaskScheduler } from "./TaskScheduler";

export class TaskSchedulerModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): void {
        dependencyRegistry.register("TaskScheduler", new TaskScheduler());
    }
}
