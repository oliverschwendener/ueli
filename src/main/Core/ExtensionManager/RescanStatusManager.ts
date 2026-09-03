import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { RescanStatus } from "@Shared/Core";

export class RescanStatusManager {
    public constructor(
        private status: RescanStatus,
        private readonly browserWindowNotifier: BrowserWindowNotifier,
    ) {}

    public change(status: RescanStatus): void {
        this.status = status;
        this.browserWindowNotifier.notifyAll({ channel: "rescanStatusChanged", data: { status } });
    }

    public get(): RescanStatus {
        return this.status;
    }
}
