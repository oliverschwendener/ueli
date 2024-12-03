import type { UuidVersion } from "./UuidVersion";

export type UuidGeneratorSetting = {
    uuidVersion: UuidVersion;
    numberOfUuids: number;
    uppercase: boolean;
    hyphens: boolean;
    braces: boolean;
    quotes: boolean;
};
