import type { AppIconFilePathResolver } from "@Core/AppIconFilePathResolver";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Notification } from "./Notification";

type ConstructorOptions = { title: string; body: string; icon?: string };

const dummyNotification = { show: vi.fn() };
const dummyNotificationConstructor = vi.fn().mockReturnValue(dummyNotification);
const isSupportedMock = vi.fn(() => true);

vi.mock("electron", () => {
    return {
        Notification: class {
            public static isSupported() {
                return isSupportedMock();
            }

            public constructor(options: ConstructorOptions) {
                return dummyNotificationConstructor(options);
            }
        },
    };
});

describe(Notification, () => {
    beforeEach(() => {
        dummyNotification.show.mockClear();
        dummyNotificationConstructor.mockClear();
        isSupportedMock.mockReset().mockReturnValue(true);
    });

    it("should do nothing when Electron Notification API is not supported", () => {
        isSupportedMock.mockReturnValue(false);
        const resolver = <AppIconFilePathResolver>{ resolve: () => "icon.png" };

        const notification = new Notification(resolver);
        notification.show({ title: "T", body: "B" });

        expect(dummyNotificationConstructor).not.toHaveBeenCalled();
        expect(dummyNotification.show).not.toHaveBeenCalled();
    });

    it("should create and show with resolved icon when supported", () => {
        const resolver = <AppIconFilePathResolver>{ resolve: () => "resolved-icon.png" };

        const notification = new Notification(resolver);
        notification.show({ title: "Hello", body: "World" });

        expect(dummyNotificationConstructor).toHaveBeenCalledTimes(1);
        expect(dummyNotificationConstructor).toHaveBeenCalledWith({
            title: "Hello",
            body: "World",
            icon: "resolved-icon.png",
        });
        expect(dummyNotification.show).toHaveBeenCalledTimes(1);
    });
});
