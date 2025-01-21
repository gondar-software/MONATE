import { MonateIcon } from '@app/components';
import { useLightMode } from '@app/global';
import { useRedirectionHelper } from '@app/helpers';

export const MonateMark = (props: any) => {
    const lightMode = useLightMode();
    const redirect = useRedirectionHelper();

    return (
        <div {...props}>
            <div className='flex cursor-pointer' onClick={() => redirect('/')}>
                <MonateIcon className='w-10 h-10' />
                <div className={`text-4xl font-bold hidden xl:block md:block sm:hidden underline ${lightMode ? 'text-gray-900' : 'text-white'}`}>ONATE</div>
            </div>
        </div>
    )
}

export default MonateMark;