import { Notification } from "electron";

export interface NotificationPresenter {
    show({ title, body }: { title: string; body: string }): void;
}

export class ElectronNotificationPresenter implements NotificationPresenter {
    public show({ title, body }: { title: string; body: string }): void {
        if (!Notification.isSupported()) {
            return;
        }

        const notification = new Notification({ title, body });
        notification.show();
    }
}
