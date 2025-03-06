import { BackgroundVideoProps } from "@app/types";
import { useEffect, useRef, useState } from "react";

export const BackgroundVideo = (props: BackgroundVideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        const handleCanPlayThrough = () => {
            setIsLoaded(true);
            video.play();
        };

        video.addEventListener("canplaythrough", handleCanPlayThrough);

        return () => {
            video.removeEventListener("canplaythrough", handleCanPlayThrough);
        };
    }, []);

    useEffect(() => {
        if (isLoaded) props.onVideoLoaded();
    }, [isLoaded]);

    return (
        <div className={props.className}>
            <div className="relative w-full h-full">
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <p className="text-white text-lg">Loading...</p>
                    </div>
                )}
                <video
                    ref={videoRef}
                    src={props.src}
                    controlsList="nodownload nofullscreen noremote"
                    className={`absolute w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                    autoPlay
                    muted
                    loop={true}
                    playsInline
                />
            </div>
        </div>
    );
};

export default BackgroundVideo;
