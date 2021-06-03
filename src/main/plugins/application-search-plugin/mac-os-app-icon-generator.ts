import { join } from "path";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import plist from "simple-plist";
import { applicationIconLocation, getApplicationIconFilePath } from "./application-icon-helpers";
import { existsSync } from "fs";
import { executeCommand } from "../../executors/command-executor";

const defaultIcnsFilePath =
    "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns";

interface InfoPlist {
    CFBundleIconFile?: string;
}

export function generateMacAppIcons(applicationFilePaths: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        if (applicationFilePaths.length === 0) {
            resolve();
        }

        FileHelpers.fileExists(applicationIconLocation)
            .then((fileExistsResult) => {
                if (!fileExistsResult.fileExists) {
                    FileHelpers.createFolderSync(applicationIconLocation);
                }

                Promise.all(applicationFilePaths.map((application) => generateMacAppIcon(application)))
                    .then(() => resolve())
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

function generateMacAppIcon(applicationFilePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        getPlistContent(applicationFilePath)
            .then((plistContent) => {
                const icnsFilePath = getIcnsFilePath(applicationFilePath, plistContent);
                const outPngFilePath = getApplicationIconFilePath(applicationFilePath);
                convertIcnsToPng(icnsFilePath, outPngFilePath)
                    .then(() => resolve())
                    .catch(() =>
                        convertIcnsToPng(defaultIcnsFilePath, outPngFilePath)
                            .then(() => resolve)
                            .catch((err) => reject(err)),
                    );
            })
            .catch((err) => reject(err));
    });
}

function convertIcnsToPng(icnsFilePath: string, outFilePath: string): Promise<void> {
    return executeCommand(`sips -s format png "${icnsFilePath}" --out "${outFilePath}"`);
}

function getIcnsFilePath(applicationFilePath: string, parsedPlistContent: InfoPlist | undefined): string {
    if (!parsedPlistContent) {
        return defaultIcnsFilePath;
    }
    if (parsedPlistContent.CFBundleIconFile) {
        if (!parsedPlistContent.CFBundleIconFile.endsWith(".icns")) {
            parsedPlistContent.CFBundleIconFile += ".icns";
        }
        const icnsFilePath = join(applicationFilePath, "Contents", "Resources", parsedPlistContent.CFBundleIconFile);
        return existsSync(icnsFilePath) ? icnsFilePath : defaultIcnsFilePath;
    } else {
        return defaultIcnsFilePath;
    }
}

function getPlistContent(applicationFilePath: string): Promise<InfoPlist | undefined> {
    return new Promise((resolve) => {
        const onError = () => resolve(undefined);
        const onSuccess = (data: InfoPlist) => resolve(data);
        const plistFilePath = join(applicationFilePath, "Contents", "Info.plist");

        if (!existsSync(plistFilePath)) {
            onError();
        } else {
            plist.readFile(plistFilePath, (err, data) => {
                if (err) {
                    onError();
                } else {
                    onSuccess(data);
                }
            });
        }
    });
}
