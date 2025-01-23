import { useState } from "react";

export const Avatar = (props: any) => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <div {...props}>
            <div className="relative inline-block">
                <div className="relative flex items-center gap-2 cursor-pointer" onClick={toggleMenu}>
                    {props.img ? (
                        <img className="w-10 h-10 rounded-full" src={props.img} alt="Avatar" />
                    ) : (
                        <div className="relative w-10 h-10 overflow-hidden flex bg-gray-100 rounded-full dark:bg-gray-600">
                            <svg
                                className="w-12 h-12 text-gray-400 justify-center"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                    )}

                    {props.status && (
                        <span
                            className={`absolute bottom-0 left-7 w-3.5 h-3.5 border-2 border-white dark:border-gray-800 rounded-full
                            ${props.status === "active" && "bg-green-400"}
                            ${props.status === "sleeping" && "bg-yellow-400"}
                            ${props.status === "out" && "bg-gray-400"}`}
                        />
                    )}

                    {props.info && (
                        <div className="font-medium dark:text-white">
                            <div>{props.info.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{props.info.location}</div>
                        </div>
                    )}
                </div>

                {props.dropDownMenu && (
                    <div
                        className={`absolute right-0 z-10 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600
                            transition-all duration-300 ease-in-out origin-top-right ${
                                isMenuOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                            }`}
                    >
                        {props.info?.email && (
                            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                <div className="font-medium truncate">{props.info.email}</div>
                            </div>
                        )}

                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                            {props.dropDownMenu.map((item: any, index: number) => (
                                <li key={index}>
                                    <a
                                        href={item.path}
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div className="py-1">
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                                Sign out
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Avatar;