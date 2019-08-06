import { join } from "path";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import * as plist from "simple-plist";
import { applicationIconLocation, getApplicationIconFilePath } from "./application-icon-helpers";
import { existsSync } from "fs";
import { executeCommand } from "../../executors/command-executor";

const defaultIcnsFilePath = "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns";

export function generateMacAppIcons(applicationFilePaths: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        if (applicationFilePaths.length === 0) {
            resolve();
        }

        FileHelpers.fileExists(applicationIconLocation)
            .then((fileExists) => {
                if (!fileExists) {
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
            .then((data) => {
                const icnsFilePath = getIcnsFilePath(applicationFilePath, data);
                const outPngFilePath = getApplicationIconFilePath(applicationFilePath);
                convertIcnsToPng(icnsFilePath, outPngFilePath)
                    .then(() => resolve())
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

function convertIcnsToPng(icnsFilePath: string, outFilePath: string): Promise<void> {
    return executeCommand(`sips -s format png "${icnsFilePath}" --out "${outFilePath}"`);
}

function getIcnsFilePath(applicationFilePath: string, parsedPlistContent: any): string {
    if (parsedPlistContent.CFBundleIconFile) {
        if (!parsedPlistContent.CFBundleIconFile.endsWith(".icns")) {
            parsedPlistContent.CFBundleIconFile += ".icns";
        }
        const icnsFilePath = join(applicationFilePath, "Contents", "Resources", parsedPlistContent.CFBundleIconFile);
        return existsSync(icnsFilePath)
            ? icnsFilePath
            : defaultIcnsFilePath;
    } else {
        return defaultIcnsFilePath;
    }
}

function getPlistContent(applicationFilePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        plist.readFile(join(applicationFilePath, "Contents", "Info.plist"), (err: string, data: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}
