import { type AppIconFilePathResolver } from "@Core/AppIconFilePathResolver/Contract";
import { Notification } from "electron";
import { type Notification as NotificationInterface } from "./Contract";

export class ElectronNotification implements NotificationInterface {
    public constructor(private readonly appIconFilePathResolver: AppIconFilePathResolver) {}

    public show({ title, body }: { title: string; body: string }): void {
        if (!Notification.isSupported()) {
            return;
        }

        const notification = new Notification({ title, body, icon: this.appIconFilePathResolver.getAppIconFilePath() });
        notification.show();
    }
}
