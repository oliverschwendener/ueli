import type { FileSystemUtility } from "@Core/FileSystemUtility";
import { describe, expect, it, vi } from "vitest";
import { ChromiumBrowserBookmark } from "./ChromiumBrowserBookmark";
import { ChromiumBrowserBookmarkRepository } from "./ChromiumBrowserBookmarkRepository";

describe(ChromiumBrowserBookmarkRepository, () => {
    describe(ChromiumBrowserBookmarkRepository.prototype.getAll, () => {
        const testGetAll = async ({
            expected,
            jsonFileContent,
        }: {
            expected: ChromiumBrowserBookmark[];
            jsonFileContent: string;
        }) => {
            const bookmarksFilePath = "path/to/bookmarks.json";

            const readJsonFileMock = vi.fn().mockResolvedValue(JSON.parse(jsonFileContent));

            const fileSystemUtility = <FileSystemUtility>{
                readJsonFile: (f) => readJsonFileMock(f),
            };

            const chromiumBrowserBookmarkRepository = new ChromiumBrowserBookmarkRepository(
                fileSystemUtility,
                () => bookmarksFilePath,
            );

            expect(await chromiumBrowserBookmarkRepository.getAll()).toEqual(expected);
        };

        it("should parse chromium bookmarks from the json file", async () => {
            await testGetAll({
                expected: [
                    new ChromiumBrowserBookmark("bookmark1", "url1", "guid1"),
                    new ChromiumBrowserBookmark("bookmark2", "url2", "guid2"),
                    new ChromiumBrowserBookmark("bookmark3", "url3", "guid3"),
                    new ChromiumBrowserBookmark("bookmark4", "url4", "guid4"),
                ],
                jsonFileContent: JSON.stringify({
                    roots: {
                        bookmark_bar: {
                            children: [
                                {
                                    children: [],
                                    guid: "guid1",
                                    name: "bookmark1",
                                    type: "url",
                                    url: "url1",
                                },
                                {
                                    children: [],
                                    guid: "guid2",
                                    name: "bookmark2",
                                    type: "url",
                                    url: "url2",
                                },
                                {
                                    children: [
                                        {
                                            children: [],
                                            guid: "guid3",
                                            name: "bookmark3",
                                            type: "url",
                                            url: "url3",
                                        },
                                        {
                                            children: [],
                                            guid: "guid4",
                                            name: "bookmark4",
                                            type: "url",
                                            url: "url4",
                                        },
                                    ],
                                    guid: "guid5",
                                    name: "bookmark5",
                                    type: "folder",
                                },
                            ],
                        },
                    },
                }),
            });
        });

        it("should ignore items without url or empty url", async () => {
            await testGetAll({
                expected: [],
                jsonFileContent: JSON.stringify({
                    roots: {
                        bookmark_bar: {
                            children: [
                                {
                                    children: [],
                                    guid: "guid1",
                                    name: "bookmark1",
                                    type: "url",
                                },
                                {
                                    children: [],
                                    guid: "guid1",
                                    name: "bookmark1",
                                    type: "url",
                                    url: "",
                                },
                            ],
                        },
                    },
                }),
            });
        });

        it("should ignore items that are not of type 'url'", async () => {
            await testGetAll({
                expected: [],
                jsonFileContent: JSON.stringify({
                    roots: {
                        bookmark_bar: {
                            children: [
                                {
                                    children: [],
                                    guid: "guid1",
                                    name: "bookmark1",
                                    type: "other",
                                    url: "url1",
                                },
                            ],
                        },
                    },
                }),
            });
        });
    });
});
