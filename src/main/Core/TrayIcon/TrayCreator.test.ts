import type { Tray } from "electron";
import { describe, expect, it, vi } from "vitest";
import { TrayCreator } from "./TrayCreator";

const dummyTray = <Tray>{};
const dummyTrayConstructor = vi.fn().mockReturnValue(dummyTray);

vi.mock("electron", () => {
    return {
        Tray: class {
            constructor(iconFilePath: string) {
                return dummyTrayConstructor(iconFilePath);
            }
        },
    };
});

describe(TrayCreator, () => {
    describe(TrayCreator.prototype.createTray, () => {
        it("should create a tray", () => {
            expect(new TrayCreator().createTray("test-tray-icon-file-path")).toBe(dummyTray);
            expect(dummyTrayConstructor).toHaveBeenCalledOnce();
            expect(dummyTrayConstructor).toHaveBeenCalledWith("test-tray-icon-file-path");
        });
    });
});
