import { randomUUID } from "crypto";
import type { RandomStringProvider as RandomStringProviderInterface } from "./Contract/RandomStringProvider";

export class RandomStringProvider implements RandomStringProviderInterface {
    public getRandomUUid(): string {
        return randomUUID();
    }
}
