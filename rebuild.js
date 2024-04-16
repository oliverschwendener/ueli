// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const child = require("child_process");

// If you prefer electron-rebuild:
// 👉 https://github.com/WiseLibs/better-sqlite3/blob/v8.5.2/docs/troubleshooting.md#electron
// 👉 https://stackoverflow.com/questions/46384591/node-was-compiled-against-a-different-node-js-version-using-node-module-versio/52796884#52796884

const better_sqlite3 = require.resolve("better-sqlite3");
const better_sqlite3_root = path.posix.join(
    better_sqlite3.slice(0, better_sqlite3.lastIndexOf("node_modules")),
    "node_modules/better-sqlite3",
);
const cp = child.spawn(
    process.platform === "win32" ? "npm.cmd" : "npm",
    [
        "run",
        "build-release",
        `--target=${process.versions.electron}`,
        // https://github.com/electron/electron/blob/v26.1.0/docs/tutorial/using-native-node-modules.md#manually-building-for-electron
        "--dist-url=https://electronjs.org/headers",
    ],
    {
        cwd: better_sqlite3_root,
        stdio: "inherit",
    },
);

cp.on("exit", (code) => {
    if (code === 0) {
        console.log("Rebuild better-sqlite3 success.");
    }
    process.exit(code);
});
