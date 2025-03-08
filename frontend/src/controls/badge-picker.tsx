import { useEffect, useState } from "react";
import { Badge } from "@app/components/badge";
import { BadgeData, BadgePickerProps, BadgeType } from "@app/types";

const badgeModes = 
{
    0: 'blue',
    1: 'gray',
    2: 'red',
    3: 'green',
    4: 'yellow',
    5: 'indigo',
    6: 'purple',
    7: 'pink',
}

export const BadgePicker = (props: BadgePickerProps) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchedBadges, setSearchedBadges] = useState<BadgeData[] | undefined>(props.badges);
    const [textInputFocused, setTextInputFocused] = useState<boolean>(false);

    useEffect(() => {
        const initializeSearchedItems = () => {
            if (!props.selectedBadges)
                setSearchedBadges([]);

            const initializedSerchedBadges = props.badges?.filter((badge: BadgeData) =>
                !props.selectedBadges.some((selected: BadgeData) => selected.id === badge.id)
            );
            setSearchedBadges(initializedSerchedBadges);
        }
        initializeSearchedItems();
    }, [props.badges, props.selectedBadges]);

    const removeBadge = (badge: BadgeData) => {
        props.setSelectedBadges?.(props.selectedBadges.filter((_badge: BadgeData) => _badge.id !== badge.id));
        updateSearchedBadges(searchQuery, props.selectedBadges.filter((_badge: BadgeData) => _badge.id !== badge.id));
    };

    const onTextInputFocused = () => {
        setTextInputFocused(true);
    };

    const onTextInputBlurred = () => {
        setSearchQuery('');
        setTimeout(() => setTextInputFocused(false), 150);
    };

    const selectBadge = (badge: BadgeData) => {
        if (!props.selectedBadges.some((selected: BadgeData) => selected.id === badge.id)) {
            props.setSelectedBadges?.([...props.selectedBadges, badge]);
        }
        setSearchQuery('');
        updateSearchedBadges('', [...props.selectedBadges, badge]);
        setTextInputFocused(false);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        updateSearchedBadges(query, props.selectedBadges);
    };

    const updateSearchedBadges = (query: string, currentSelectedBadges: BadgeData[]) => {
        const filteredBadges = props.badges?.filter((badge: BadgeData) =>
            badge.name.toLowerCase().includes(query.toLowerCase()) &&
            !currentSelectedBadges.some((selected: BadgeData) => selected.id === badge.id)
        );
        setSearchedBadges(filteredBadges);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && searchQuery === '') {
            if (props.selectedBadges.length > 0) {
                const lastItem = props.selectedBadges[props.selectedBadges.length - 1];
                removeBadge(lastItem);
            }
        }
    };

    return (
        <div className={props.disabled ? "flex gap-1 w-full overflow-hidden" : "pl-3 flex items-center flex-wrap bg-gray-50 dark:bg-gray-600 border border-gray-300 rounded-lg p-2 gap-y-2 dark:border-gray-500"}>
            {props.selectedBadges.map((badge: BadgeData, index: number) => (
                <div className={!props.disabled ? "h-6" : ""} key={index}>
                    <Badge 
                        onCloseButtonClick={() => removeBadge(badge)} 
                        hiddenRemoveButton={props.disabled}
                        name={badge.name} 
                        type={badgeModes[(index % 8) as keyof typeof badgeModes] as BadgeType} />
                </div>
            ))}
            {props.selectedBadges.length !== props.maxBadges && !props.disabled && 
            <div className="relative h-6 flex flex-col flex-grow">
                <input
                    type="text"
                    className="h-full w-full min-w-32 border-0 pl-0 text-sm bg-transparent dark:bg-transparent text-gray-900 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0 focus:border-transparent"
                    placeholder={props.placeholder}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={onTextInputFocused}
                    onBlur={onTextInputBlurred}
                    onKeyDown={handleKeyDown}
                />

                {textInputFocused && searchedBadges?.length !== 0 && (
                    <div className="absolute overflow-y-auto w-44 left-0 right-0 z-10 mt-8 max-h-32 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
                        {searchedBadges?.map((badge: BadgeData, index: number) => (
                            <div
                                key={index}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                                onMouseDown={() => selectBadge(badge)}
                            >
                                {badge.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>}
        </div>
    );
};

export default BadgePicker;
