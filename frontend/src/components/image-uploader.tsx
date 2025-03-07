import { useAlert } from "@app/providers";
import { ImageUploaderProps } from "@app/types";
import { useEffect, useState } from "react";

export const ImageUploader = (props: ImageUploaderProps) => {
    const [selectedImage, setSelectedImage] = useState<string | undefined>(props.initUrl);
    const { addAlert } = useAlert();

    useEffect(() => {
        setSelectedImage(props.initUrl);
    }, [props.initUrl]);

    const maxWidth = props.maxWidth || 800;
    const maxHeight = props.maxHeight || 400;

    const handleImageUpload = (file: File) => {
        if (props.disabled)
            return;
        const img = new Image();
        img.onload = () => {
            if (img.width > maxWidth || img.height > maxHeight) {
                addAlert({
                    type: "warning",
                    title: "Image too large",
                    message: `Please upload an image smaller than ${maxWidth}x${maxHeight} pixels.`,
                });
                setSelectedImage("");
            } else {
                setSelectedImage(URL.createObjectURL(file));
                props.onImageUpload(file);
            }
        };
        img.src = URL.createObjectURL(file);
    };

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) handleImageUpload(file);
    };

    const handleDrop = (event: any) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) handleImageUpload(file);
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
                    {!selectedImage && (
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
                                PNG, JPG <br/>(MAX: {maxWidth}x{maxHeight}px)
                            </p>
                        </div>
                    )}
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="Uploaded preview"
                            className="w-full h-full rounded-lg"
                        />
                    )}
                    <input
                        id={`dropzone-file-${props.id}`}
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="hidden"
                        disabled={props.disabled}
                        onChange={handleFileChange}
                    />
                </label>
            </div>
        </div>
    );
};

export default ImageUploader;
