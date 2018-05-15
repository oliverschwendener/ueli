import { Count } from "./count";

export interface CountRepository {
    getCount(): Count;
    getScore(key: string): number;
    updateCount(count: Count): void;
}
