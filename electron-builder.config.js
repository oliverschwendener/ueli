/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const baseConfig = {
    asar: true,
    asarUnpack: ["**/node_modules/sharp/**/*", "**/node_modules/@img/**/*"],
    productName: "Ueli",
    directories: {
        output: "release",
        buildResources: "build",
    },
    files: ["dist-main/**/*.js", "dist-preload/index.js", "dist-renderer/**/*", "assets/**/*"],
    extraMetadata: {
        version: process.env.VITE_APP_VERSION,
    },
};

/**
 * @type {Record<NodeJS.Platform, import('electron-builder').Configuration>}
 */
const platformSpecificConfig = {
    darwin: {
        ...baseConfig,
        afterPack: "./build/macos/codeSign.mjs",
        mac: {
            category: "public.app-category.utilities",
            icon: "assets/Build/app-icon-dark.png",
            target: [{ target: "dmg" }, { target: "zip" }],
        },
    },
    win32: {
        ...baseConfig,
        appx: {
            applicationId: "OliverSchwendener.Ueli",
            backgroundColor: "#1F1F1F",
            displayName: "Ueli",
            identityName: "1915OliverSchwendener.Ueli",
            publisher: "CN=AD6BF16D-50E3-4FD4-B769-78A606AFF75E",
            publisherDisplayName: "Oliver Schwendener",
            languages: ["en-US", "de-CH"],
        },
        win: {
            icon: "assets/Build/app-icon-dark-transparent.png",
            target: [{ target: "msi" }, { target: "nsis" }, { target: "zip" }, { target: "appx" }],
        },
    },
    linux: {
        ...baseConfig,
        linux: {
            icon: "assets/Build/app-icon-dark.png",
            category: "Utility",
            target: [{ target: "AppImage" }, { target: "deb" }, { target: "zip" }],
        },
    },
};

module.exports = platformSpecificConfig[process.platform];
