import { createContext, useState } from 'react';
import { 
    useSaveVideo1Loaded,
    useSaveVideo2Loaded,
    useVideo1Loaded,
    useVideo2Loaded,
    useVideoBackgroundMode,
} from '@app/global';
import { BackgroundVideo, LoadingMonate } from '@app/components';

const UnityBackgroundContext = createContext<any | undefined>(undefined);

export const VideoBackgroundProvider = (props: any) => {
    const saveVideo1Loaded = useSaveVideo1Loaded();
    const saveVideo2Loaded = useSaveVideo2Loaded();
    const video1Loaded = useVideo1Loaded();
    const video2Loaded = useVideo2Loaded();
    const videoBackgroundMode = useVideoBackgroundMode();

    const [hasInteracted, setHasInteracted] = useState(false);

    const handleMouseMove = (_: any) => {
        if (!hasInteracted) {
            setHasInteracted(true);
        }
    };

    return(
        <UnityBackgroundContext.Provider value={{}}>
            <div className='fixed w-full h-full left-0 top-0'>
                <BackgroundVideo src='/1.mp4' onVideoLoaded={() => saveVideo1Loaded(true)} className={`w-full h-full absolute ${videoBackgroundMode === 0 ? 'visible' : 'hidden'}`} />
                <BackgroundVideo src='/2.mp4' onVideoLoaded={() => saveVideo2Loaded(true)} className={`w-full h-full absolute ${videoBackgroundMode === 1 ? 'visible' : 'hidden'}`} />
            </div>
            {!(video1Loaded && video2Loaded) && 
                <LoadingMonate
                    className="w-full h-full absolute left-0 top-0"
                />}
            <div className={`w-full min-h-screen absolute left-0 top-0 transition-all duration-300 
                ${(video1Loaded && video2Loaded) ? 'opacity-100' : 'opacity-0'} 
                ${hasInteracted ? 'bg-gray-100 bg-opacity-80 dark:bg-black dark:bg-opacity-80' : 'bg-transparent'}`}
                onMouseMove={handleMouseMove}>
                {(video1Loaded && video2Loaded) && <div className={`w-full min-h-screen left-0 top-0 flex justify-center items-center`}>
                    {props.children}
                </div>}
            </div>
        </UnityBackgroundContext.Provider>
    );
};

export default VideoBackgroundProvider;