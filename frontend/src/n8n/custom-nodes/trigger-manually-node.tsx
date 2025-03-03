import { BsLightningFill } from "@app/components";
import { useState } from "react";

export const TriggerManuallyNode = () => {
    const [focused, setFocused] = useState(false);

    const handleMouseEnter = () => {
        setFocused(true);
    };

    const handleMouseLeave = () => {
        setFocused(false);
    };

    return (
        <div className="relative flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <button type='button' className={`${focused ? 'opacity-100' : 'opacity-0'} duration-150 transition-opacity absolute -left-24 text-sm -ml-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md p-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 whitespace-nowrap`}>
                Run workflow
            </button>
            <div className="w-24 h-24 rounded-l-3xl rounded-r-md shadow-md dark:border dark:border-gray-500 bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="w-8 h-8">
                    <BsLightningFill />
                </div>
            </div>
        </div>
    );
};
