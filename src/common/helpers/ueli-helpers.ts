import { join } from "path";
import { homedir } from "os";

export const ueliTempFolder = join(homedir(), ".ueli");
export const logFilePath = join(ueliTempFolder, "debug.log");
