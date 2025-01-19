import { useNavigate } from 'react-router-dom';
import { MonateIcon } from '@app/components';
import { useLightMode } from '@app/global';
import { routes } from '@app/routes';

export const MonateMark = (props: any) => {
    const lightMode = useLightMode();
    const navigate = useNavigate();

    return (
        <div {...props} className={`flex cursor-pointer ${props.className}`} onClick={() => navigate(`${routes[0].layout}${routes[0].pages[1].path}`)}>
            <MonateIcon className='w-10 h-10' />
            <div className={`text-4xl font-bold hidden xl:block md:block sm:hidden underline ${lightMode ? 'text-gray-900' : 'text-white'}`}>ONATE</div>
        </div>
    )
}

export default MonateMark;