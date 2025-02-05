import { useEffect, useState } from "react";
import { Badge } from "@app/components/badge";

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

interface BadgePickerParams
{
    badges: any[];
    selectedBadges: any[];
    setSelectedBadges: (badges: any[]) => void;
    maxBadges? : number;
    placeholder: string;
    disabled? : boolean;
}

export const BadgePicker = ({ badges, selectedBadges, setSelectedBadges, maxBadges = 3, placeholder, disabled }: BadgePickerParams) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedBadges, setSearchedBadges] = useState(badges);
    const [textInputFocused, setTextInputFocused] = useState(false);

    useEffect(() => {
        const initializeSearchedItems = () => {
            if (!selectedBadges)
                setSearchedBadges([]);

            const initializedSerchedBadges = badges.filter((badge: any) =>
                !selectedBadges.some((selected: any) => selected.id === badge.id)
            );
            setSearchedBadges(initializedSerchedBadges);
        }
        initializeSearchedItems();
    }, [badges, selectedBadges]);

    const removeBadge = (badge: any) => {
        setSelectedBadges(selectedBadges.filter((_badge: any) => _badge.id !== badge.id));
        updateSearchedBadges(searchQuery, selectedBadges.filter((_badge: any) => _badge.id !== badge.id));
    };

    const onTextInputFocused = () => {
        setTextInputFocused(true);
    };

    const onTextInputBlurred = () => {
        setSearchQuery('');
        setTimeout(() => setTextInputFocused(false), 150);
    };

    const selectBadge = (badge: any) => {
        if (!selectedBadges.some((selected: any) => selected.id === badge.id)) {
            setSelectedBadges([...selectedBadges, badge]);
        }
        setSearchQuery('');
        updateSearchedBadges('', [...selectedBadges, badge]);
        setTextInputFocused(false);
    };

    const handleSearchChange = (event: any) => {
        const query = event.target.value;
        setSearchQuery(query);
        updateSearchedBadges(query, selectedBadges);
    };

    const updateSearchedBadges = (query: any, currentSelectedBadges: any) => {
        const filteredBadges = badges.filter((badge: any) =>
            badge.name.toLowerCase().includes(query.toLowerCase()) &&
            !currentSelectedBadges.some((selected: any) => selected.id === badge.id)
        );
        setSearchedBadges(filteredBadges);
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Backspace' && searchQuery === '') {
            if (selectedBadges.length > 0) {
                const lastItem = selectedBadges[selectedBadges.length - 1];
                removeBadge(lastItem);
            }
        }
    };

    return (
        <div className="pl-3 flex items-center flex-wrap bg-gray-50 dark:bg-gray-600 border border-gray-300 rounded-lg p-2 gap-y-2 dark:border-gray-500">
            {selectedBadges.map((badge: any, index: any) => (
                <Badge className='h-6' onClose={() => removeBadge(badge)} key={index} name={badge.name} mode={badgeModes[(index % 8) as keyof typeof badgeModes]} />
            ))}
            {selectedBadges.length !== maxBadges && !disabled && 
            <div className="relative h-6 flex flex-col flex-grow">
                <input
                    type="text"
                    className="h-full w-full min-w-32 border-0 pl-0 text-sm bg-transparent dark:bg-transparent text-gray-900 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0 focus:border-transparent"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={onTextInputFocused}
                    onBlur={onTextInputBlurred}
                    onKeyDown={handleKeyDown}
                />

                {textInputFocused && searchedBadges.length !== 0 && (
                    <div className="absolute overflow-y-auto w-44 left-0 right-0 z-10 mt-8 max-h-32 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
                        {searchedBadges.map((badge: any, index: any) => (
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
