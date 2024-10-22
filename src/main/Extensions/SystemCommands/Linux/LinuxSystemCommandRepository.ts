import type { SystemCommand } from "../SystemCommand";
import type { SystemCommandRepository } from "../SystemCommandRepository";

export class LinuxSystemCommandRepository implements SystemCommandRepository {
    public getAll(): Promise<SystemCommand[]> {
        throw new Error("Method not implemented.");
    }
}
