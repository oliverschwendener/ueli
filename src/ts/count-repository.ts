import { Count } from "./count";

export interface CountRepository {
    getCount(): Count;
    updateCount(count: Count): void;
}
