import { 
    useGardenLoaded,
    useOasisLoaded,
} from "@app/global";
import { 
    UnityGardenControl,
    UnityOasisControl,
} from "@app/controls";

export const UnityBackground = (props: any) => {
    const gardenLoaded = useGardenLoaded();
    const oasisLoaded = useOasisLoaded();

    return (
        <div {...props}>
            <UnityGardenControl className={`w-full h-full absolute ${props.name === 'garden' && gardenLoaded && oasisLoaded ? 'visible' : 'hidden'}`} />
            <UnityOasisControl className={`w-full h-full absolute ${props.name === 'oasis' && gardenLoaded && oasisLoaded ? 'visible' : 'hidden'}`} />
        </div>
    )
}

export default UnityBackground;