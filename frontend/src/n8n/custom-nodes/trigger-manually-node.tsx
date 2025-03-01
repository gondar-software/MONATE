import { BsLightningFill } from "@app/components";

export const TriggerManuallyNode = () => {
    return (
        <div className="w-24 h-24 rounded-l-3xl rounded-r-md shadow-md dark:border dark:border-gray-500 bg-white dark:bg-gray-900">
            <div className="absolute flex w-full h-full justify-center items-center">
                <div className="w-8 h-8">
                    <BsLightningFill />
                </div>
            </div>
            <div className='absolute flex h-full items-center'>
            </div>
        </div>
    )
}