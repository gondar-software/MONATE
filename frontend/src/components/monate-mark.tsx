import { MonateIcon } from '@app/components';
import { useRedirectionHelper } from '@app/helpers';

export const MonateMark = (props: any) => {
    const redirect = useRedirectionHelper();

    return (
        <div {...props}>
            <button type='button' className='flex cursor-pointer' onClick={() => redirect('/')}>
                <MonateIcon className='w-10 h-10' />
                <div className='text-4xl font-bold hidden xl:block md:block sm:hidden underline text-gray-900 dark:text-gray-100'>ONATE</div>
            </button>
        </div>
    )
}

export default MonateMark;