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
    files: ["dist-main/index.js", "dist-preload/index.js", "dist-renderer/**/*", "assets/**/*"],
    extraMetadata: {
        version: process.env.VITE_APP_VERSION,
    },
    mac: {
        hardenedRuntime: true,
        gatekeeperAssess: false,
        icon: "assets/Build/app-icon-dark.png",
        target: [
            { target: "dmg", arch: "universal" },
            { target: "zip", arch: "universal" },
        ],
    },
    win: {
        icon: "assets/Build/app-icon-dark-transparent.png",
        target: [{ target: "msi" }, { target: "nsis" }, { target: "zip" }, { target: "appx" }],
    },
    linux: {
        icon: "assets/Build/app-icon-dark.png",
        category: "Utility",
        target: [{ target: "AppImage" }, { target: "deb" }, { target: "zip" }],
    },
};
