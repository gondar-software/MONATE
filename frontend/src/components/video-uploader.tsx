import { VideoUploaderProps } from "@app/types";
import { useEffect, useState } from "react";

export const VideoUploader = (props: VideoUploaderProps) => {
    const [selectedVideo, setSelectedVideo] = useState<string | undefined>(props.initUrl);

    useEffect(() => {
        setSelectedVideo(props.initUrl);
    }, [props.initUrl]);

    const handleVideoUpload = (file: File) => {
        if (props.disabled)
            return;
        if (!file.type.startsWith('video/'))
            return;
        props.onVideoUpload(file);
        setSelectedVideo(URL.createObjectURL(file));
    };

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) handleVideoUpload(file);
    };

    const handleDrop = (event: any) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) handleVideoUpload(file);
    };

    const handleDragOver = (event: any) => {
        event.preventDefault();
    };

    return (
        <div className={props.className}>
            <div
                className="flex items-center justify-center w-full h-full"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <label
                    htmlFor={`dropzone-file-${props.id}`}
                    className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 relative"
                >
                    {!selectedVideo && (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                            </svg>
                            <p className="mb-2 text-sm text-center text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                MP4, AVI, MOV, WMV, MPG
                            </p>
                        </div>
                    )}
                    {selectedVideo && (
                        <video
                            src={selectedVideo}
                            className="w-full h-full rounded-lg"
                            controlsList="nodownload nofullscreen noremote"
                            autoPlay
                            loop={true}
                            muted
                            playsInline
                        />
                    )}
                    <input
                        id={`dropzone-file-${props.id}`}
                        type="file"
                        accept=".mp4,.avi,.mov,.wmv,.mpg"
                        className="hidden"
                        disabled={props.disabled}
                        onChange={handleFileChange}
                    />
                </label>
            </div>
        </div>
    );
};

export default VideoUploader;
