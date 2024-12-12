import type { SystemCommand } from "./SystemCommand";

export interface SystemCommandRepository {
    getAll(): Promise<SystemCommand[]>;
}
