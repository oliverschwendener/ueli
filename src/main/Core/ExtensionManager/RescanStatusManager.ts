import type { RescanStatus } from "@common/Core";
import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";

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
