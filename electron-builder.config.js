/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
    appId: "com.electron.fluentui",
    productName: "Electron Fluent UI",
    directories: {
        output: "release",
        buildResources: "build",
    },
    files: ["dist-electron/**/*.js", "dist/**/*"],
    extraMetadata: {
        version: process.env.VITE_APP_VERSION,
    },
    mac: {
        hardenedRuntime: true,
        gatekeeperAssess: false,
        target: [
            {
                target: "dmg",
                arch: "universal",
            },
            {
                target: "zip",
                arch: "universal",
            },
        ],
    },
    win: {
        target: [
            {
                target: "msi",
            },
            {
                target: "nsis",
            },
            {
                target: "zip",
            },
        ],
    },
    linux: {
        category: "Utility",
        target: [
            {
                target: "AppImage",
            },
            {
                target: "deb",
            },
            {
                target: "zip",
            },
        ],
    },
};

module.exports = config;
