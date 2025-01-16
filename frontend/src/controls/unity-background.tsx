import { 
    useGardenProgress,
    useOasisProgress,
    useGardenLoaded,
    useOasisLoaded,
} from "@app/global";
import { 
    UnityGardenControl,
    UnityOasisControl,
} from "@app/controls";
import { LoadingMonate } from '@app/components';

export const UnityBackground = (props: any) => {
    const gardenProgress = useGardenProgress();
    const oasisProgress = useOasisProgress();
    const gardenLoaded = useGardenLoaded();
    const oasisLoaded = useOasisLoaded();

    return (
        <div {...props}>
            <UnityGardenControl className={`w-full h-full ${props.name === 'garden' && gardenLoaded && oasisLoaded ? 'visible' : 'hidden'}`} />
            <UnityOasisControl className={`w-full h-full ${props.name === 'oasis' && gardenLoaded && oasisLoaded ? 'visible' : 'hidden'}`} />
            {!(gardenLoaded && oasisLoaded) && 
                <LoadingMonate className='w-full h-full' progress={(gardenProgress + oasisProgress) / 2.} />
            }
        </div>
    )
}

export default UnityBackground;