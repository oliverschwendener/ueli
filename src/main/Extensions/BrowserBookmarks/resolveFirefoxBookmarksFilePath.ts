import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { OperatingSystem } from "@common/Core";
import type { App } from "electron";
import { join } from "path";

const getRelevantProfile = (profileNames: string[]): string => {
    const profile = profileNames.find((profileName) => profileName.endsWith("-release"));

    if (profile) {
        return profile;
    }

    throw new Error("Unable to find profile");
};

export const resolveFirefoxBookmarksFilePath = ({
    operatingSystem,
    app,
    fileSystemUtility,
}: {
    operatingSystem: OperatingSystem;
    app: App;
    fileSystemUtility: FileSystemUtility;
}): string => {
    const getSqliteFilePathFromProfile = (profileFolderPath: string): string =>
        join(
            profileFolderPath,
            getRelevantProfile(fileSystemUtility.readFolderSync(profileFolderPath)),
            "places.sqlite",
        );

    const map: Record<OperatingSystem, () => string> = {
        Linux: () => null,
        macOS: () => getSqliteFilePathFromProfile(join(app.getPath("appData"), "Firefox", "Profiles")),
        Windows: () =>
            getSqliteFilePathFromProfile(
                join(app.getPath("home"), "AppData", "Roaming", "Mozilla", "Firefox", "Profiles"),
            ),
    };

    return map[operatingSystem]();
};
