import type { DateProvider as DateProviderInterface } from "./Contract";

export class DateProvider implements DateProviderInterface {
    public get() {
        return new Date();
    }
}
