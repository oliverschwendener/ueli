import { isDev } from "./is-dev";

describe(isDev, () => {
    it("should return true when process exec path ends with 'electron' or 'electron.exe'", () => {
        const processExecPaths = [
            "electron",
            "electron.exe",
            "C:\\Users\\ueli\\projects\\ueli\\node_modules\\.bin\\electron.exe",
            "C:\\Users\\ueli\\projects\\ueli\\node_modules\\.bin\\electron",
            "/Users/ueli/project/ueli/node_modules/.bin/electron",
        ];

        processExecPaths.forEach((processExecPath) => {
            expect(isDev(processExecPath)).toBe(true);
        });
    });

    it("should return false when process exec path does not end with 'electron' or 'electron.exe'", () => {
        const processExecPaths = [
            "ueli",
            "ueli.exe",
            "C:\\Users\\ueli\\projects\\ueli\\ueli.exe",
            "C:\\Users\\ueli\\projects\\ueli\\ueli",
            "/Users/ueli/project/ueli/node_modules/.bin/ueli",
            "/Applications/ueli/ueli",
        ];

        processExecPaths.forEach((processExecPath) => {
            expect(isDev(processExecPath)).toBe(false);
        });
    });
});
