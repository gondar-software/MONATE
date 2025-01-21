import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useLightMode, useSaveLightMode } from "@app/global"

export const ModeSwitch = (props: any) => {
    const lightMode = useLightMode();
    const saveLightMode = useSaveLightMode();

    return (
        <div {...props}>
            <div className="h-full w-full cursor-pointer" onClick={() => saveLightMode(!lightMode)}>
                {lightMode ? <MoonIcon className="text-gray-900" /> : <SunIcon className="text-white" />}
            </div>
        </div>
    )
}