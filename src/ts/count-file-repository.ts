import { CountRepository } from "./count-repository";
import { Count } from "./count";

export class CountFileRepository implements CountRepository {
    public getCount(): Count {
        throw new Error("not implemented");
    }
}
