const icon = "assets/Build/app-icon-dark.png";

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
        icon,
        target: [
            { target: "dmg", arch: "universal" },
            { target: "zip", arch: "universal" },
        ],
    },
    win: {
        icon,
        target: [{ target: "msi" }, { target: "nsis" }, { target: "zip" }],
    },
    linux: {
        icon,
        category: "Utility",
        target: [{ target: "AppImage" }, { target: "deb" }, { target: "zip" }],
    },
};
