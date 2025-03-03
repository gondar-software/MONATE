export const FormFileUploader1 = (props: any) => {
    const handleFileChange = (event: any) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            const type = uploadedFile.type;
            let fileType = '';
            if (type.startsWith("image/")) {
                fileType = "image";
            } else if (type.startsWith("video/")) {
                fileType = "video";
            } else {
                fileType = "unknown";
            }

            props.setFileData(uploadedFile, fileType);
        }
    };
    return (
        <div className="flex flex-col items-center">
            <label
                htmlFor="file_input"
                className="flex items-center justify-center w-full px-5 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-500 bg-gray-200 hover:bg-gray-100 dark:bg-gray-600 rounded-lg cursor-pointer dark:hover:bg-gray-700"
            >
                {props.label}
            </label>
            <input
                type="file"
                id="file_input"
                accept=".jpg,.png,.gif,.jpeg,.mp4,.webm,.avi,.mov,.mkv"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}

export const FormFileItem1 = (props: any) => {
    return (
        <div className="flex">
            <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 stroke-gray-500 dark:stroke-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                        <path d="M6 2H14L18 6V20C18 21.1 17.1 22 16 22H8C6.9 22 6 21.1 6 20V4C6 2.9 6.9 2 8 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V6H18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <input disabled value={props.value} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
            </div>
            <button onClick={props.onDelete} type="button" className="flex items-center justify-center ml-2 px-3 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-500 bg-gray-200 hover:bg-gray-100 dark:bg-gray-600 rounded-lg cursor-pointer dark:hover:bg-gray-700">
                <svg className="w-4 h-4 stroke-gray-500 dark:stroke-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path d="M3 6H5H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6H19Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 11V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 11V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="sr-only">Delete</span>
            </button>
        </div>
    )
}