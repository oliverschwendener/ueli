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
                    new ChromiumBrowserBookmark("bookmark6", "url6", "guid6"),
                    new ChromiumBrowserBookmark("bookmark7", "url7", "guid7"),
                    new ChromiumBrowserBookmark("bookmark8", "url8", "guid8"),
                    new ChromiumBrowserBookmark("bookmark9", "url9", "guid9"),
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
                        other: {
                            children: [
                                {
                                    children: [],
                                    guid: "guid6",
                                    name: "bookmark6",
                                    type: "url",
                                    url: "url6",
                                },
                                {
                                    children: [],
                                    guid: "guid7",
                                    name: "bookmark7",
                                    type: "url",
                                    url: "url7",
                                },
                                {
                                    children: [
                                        {
                                            children: [],
                                            guid: "guid8",
                                            name: "bookmark8",
                                            type: "url",
                                            url: "url8",
                                        },
                                        {
                                            children: [],
                                            guid: "guid9",
                                            name: "bookmark9",
                                            type: "url",
                                            url: "url9",
                                        },
                                    ],
                                    guid: "guid10",
                                    name: "bookmark10",
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
                        other: {
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
                        other: {
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
