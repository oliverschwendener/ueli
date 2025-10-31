import { type AppIconFilePathResolver } from "@Core/AppIconFilePathResolver/Contract";
import { Notification as ElectronNotification } from "electron";
import { type Notification as NotificationInterface } from "./Contract";

export class Notification implements NotificationInterface {
    public constructor(private readonly appIconFilePathResolver: AppIconFilePathResolver) {}

    public show({ title, body }: { title: string; body: string }): void {
        if (!ElectronNotification.isSupported()) {
            return;
        }

        const notification = new ElectronNotification({ title, body, icon: this.appIconFilePathResolver.resolve() });
        notification.show();
    }
}
