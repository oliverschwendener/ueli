import { TrayIconPathBuilder } from "../../../ts/builders/tray-icon-path-builder";
import { join } from "path";

describe(TrayIconPathBuilder.name, (): void => {
    const pathToRoot = join("..", "..", "..");

    describe(TrayIconPathBuilder.buildMacOsTrayIconPath.name, (): void => {
        it("should build the path to the mac os tray icon correctly", (): void => {
            const expected = join(pathToRoot, join("img", "icons", "mac", "ueliTemplate.png"));

            const actual = TrayIconPathBuilder.buildMacOsTrayIconPath(pathToRoot);

            expect(actual).toBe(expected);
        });
    });

    describe(TrayIconPathBuilder.buildWindowsTrayIconPath.name, (): void => {
        it("should build the path to the mac os tray icon correctly", (): void => {
            const expected = join(pathToRoot, join("img", "icons", "win", "icon.ico"));

            const actual = TrayIconPathBuilder.buildWindowsTrayIconPath(pathToRoot);

            expect(actual).toBe(expected);
        });
    });
});
