import { Clock as ClockInterface } from "./Contract";

export class Clock implements ClockInterface {
    public getCurrentTimeAsString(): string {
        return new Date().toLocaleString();
    }
}
