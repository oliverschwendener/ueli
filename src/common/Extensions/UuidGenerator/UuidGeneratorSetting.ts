import type { UuidFormat } from "./UuidFormat";
import type { UuidVersion } from "./UuidVersion";

export type UuidGeneratorSetting = {
    uuidVersion: UuidVersion;
    numberOfUuids: number;
    generatorFormat: UuidFormat;
    searchResultFormats: UuidFormat[];
};
