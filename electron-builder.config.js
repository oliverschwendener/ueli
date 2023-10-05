/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
    productName: "Ueli",
    directories: {
        output: "release",
        buildResources: "build",
    },
    files: ["dist-main/index.js", "dist-preload/index.js", "dist-renderer/**/*"],
    extraMetadata: {
        version: process.env.VITE_APP_VERSION,
    },
    mac: {
        hardenedRuntime: true,
        gatekeeperAssess: false,
        target: [
            { target: "dmg", arch: "universal" },
            { target: "zip", arch: "universal" },
        ],
    },
    win: {
        icon: "build/windows-app-icon-dark-background.png",
        target: [{ target: "msi" }, { target: "nsis" }, { target: "zip" }],
    },
    linux: {
        category: "Utility",
        target: [{ target: "AppImage" }, { target: "deb" }, { target: "zip" }],
    },
};
