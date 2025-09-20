import { Notification } from "electron";

export interface NotificationService {
    show({ title, body }: { title: string; body: string }): void;
}

export class ElectronNotificationService implements NotificationService {
    public show({ title, body }: { title: string; body: string }): void {
        if (!Notification.isSupported()) {
            return;
        }

        const notification = new Notification({ title, body });
        notification.show();
    }
}
