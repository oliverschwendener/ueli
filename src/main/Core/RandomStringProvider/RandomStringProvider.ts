import { randomBytes } from "crypto";
import type { RandomStringProvider as RandomStringProviderInterface } from "./Contract/RandomStringProvider";

export class RandomStringProvider implements RandomStringProviderInterface {
    public getRandomHexString(byteLength: number): string {
        return randomBytes(byteLength).toString("hex");
    }
}
