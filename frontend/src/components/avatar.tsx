import { useSaveToken, useSaveUserInfo } from "@app/global";
import { useRedirectionHelper } from "@app/helpers";
import { useEffect, useRef, useState } from "react";

export const Avatar = (props: any) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const saveUserInfo = useSaveUserInfo();
    const saveToken = useSaveToken();
    const redirect = useRedirectionHelper();
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div {...props} ref={menuRef}>
            <div className="relative inline-block">
                <div className="relative flex items-center gap-2 cursor-pointer" onClick={toggleMenu}>
                    {props.info.avatar ? (
                        <img className="w-10 h-10 rounded-full" src={props.info.avatar} alt="Avatar" />
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

                {props.info.menu && (
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

                        <ul className="py-2 w-full text-sm text-gray-700 dark:text-gray-200">
                            {props.info.menu.map((item: any, index: number) => (
                                <li key={index} className="w-full">
                                    <button
                                        type='button'
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            redirect(item.path);
                                        }}
                                        className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="py-1 w-full">
                            <button
                                type='button'
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    saveUserInfo(null);
                                    saveToken('');
                                    redirect('/');
                                }}
                                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Avatar;
