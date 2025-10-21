export type BookmarkItem = {
    children: BookmarkItem[];
    guid: string;
    name: string;
    type: "folder" | "url";
    url?: string;
};

export type ChromiumBrowserBookmarkFile = {
    roots: {
        bookmark_bar: BookmarkItem;
        other: BookmarkItem;
    };
};
