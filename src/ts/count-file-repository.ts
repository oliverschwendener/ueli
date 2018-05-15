import { CountRepository } from "./count-repository";
import { Count } from "./count";

export class CountFileRepository implements CountRepository {
    public getCount(): Count {
        throw new Error("not implemented");
    }

    public getScore(key: string): number {
        throw new Error("Method not implemented.");
    }

    public updateCount(count: Count): void {
        throw new Error("Method not implemented.");
    }
}
