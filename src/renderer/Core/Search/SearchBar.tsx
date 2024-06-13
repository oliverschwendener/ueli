import { useContextBridge } from "@Core/Hooks";
import { Input } from "@fluentui/react-components";
import { SearchRegular } from "@fluentui/react-icons";
import type { ChangeEvent, KeyboardEvent, ReactElement, RefObject } from "react";
import type { SearchBarAppearance } from "./SearchBarAppearance";
import type { SearchBarSize } from "./SearchBarSize";

type SearchBarProps = {
    refObject?: RefObject<HTMLInputElement>;
    searchTerm?: string;
    onSearchTermUpdated?: (searchTerm: string) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    contentAfter?: ReactElement;
    searchBarSize: SearchBarSize;
    searchBarAppearance: SearchBarAppearance;
    searchBarPlaceholderText: string;
    showIcon: boolean;
};

export const SearchBar = ({
    searchTerm,
    onSearchTermUpdated,
    refObject,
    onKeyDown,
    contentAfter,
    searchBarAppearance,
    searchBarPlaceholderText,
    searchBarSize,
    showIcon,
}: SearchBarProps) => {
    const { contextBridge } = useContextBridge();

    const onChange = onSearchTermUpdated
        ? (_: ChangeEvent<HTMLInputElement>, { value }: { value: string }) => onSearchTermUpdated(value)
        : undefined;

    return (
        <Input
            className="non-draggable-area"
            ref={refObject}
            appearance={
                searchBarAppearance === "auto"
                    ? contextBridge.themeShouldUseDarkColors()
                        ? "filled-darker"
                        : "filled-lighter"
                    : searchBarAppearance
            }
            size={searchBarSize}
            value={searchTerm}
            onChange={onChange}
            onKeyDown={onKeyDown}
            contentBefore={showIcon ? <SearchRegular /> : undefined}
            contentAfter={contentAfter}
            placeholder={searchBarPlaceholderText}
        />
    );
};
