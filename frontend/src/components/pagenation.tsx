import { useEffect, useState } from "react";

export const Pagenation = (props: any) => {
    const [currentPage, setCurrentPage] = useState(props.initPage ?? 1);
    const [showingPages, setShowingPages] = useState<number[]>([]);

    useEffect(() => {
        const totalPages = props.maxPage ?? 1;
        const pagesToShow = [];
        
        const range = 2;
        for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
            pagesToShow.push(i);
        }

        setShowingPages(pagesToShow);

        props.onChangePage(currentPage);
    }, [props.maxPage, currentPage]);

    const handleClick = (page: number) => {
        setCurrentPage(page);
    }

    return (
        <nav aria-label={props.label}>
            <ul className="flex items-center -space-x-px h-10 text-base">
                <li>
                    <button disabled={currentPage <= 1} type='button' onClick={() => handleClick(currentPage - 1)} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span className="sr-only">Previous</span>
                        <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
                        </svg>
                    </button>
                </li>
                {showingPages.map((page: number, index: number) => (<li key={index}>
                    <button type='button' onClick={() => handleClick(page)} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{page}</button>
                </li>))}
                <li>
                    <button disabled={currentPage >= props.maxPage} type='button' onClick={() => handleClick(currentPage + 1)} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span className="sr-only">Next</span>
                        <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Pagenation;