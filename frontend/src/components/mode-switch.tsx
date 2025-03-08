import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useLightMode, useSaveLightMode } from "@app/global"
import { ModeSwitchProps } from "@app/types";

export const ModeSwitch = (props: ModeSwitchProps) => {
    const lightMode = useLightMode();
    const saveLightMode = useSaveLightMode();

    return (
        <div className={props.className}>
            <div className="h-full w-full cursor-pointer" onClick={() => saveLightMode(!lightMode)}>
                {lightMode ? <MoonIcon className="text-gray-900" /> : <SunIcon className="text-gray-100" />}
            </div>
        </div>
    )
}