import { useNavigate } from 'react-router-dom';
import { useLightMode } from '@app/global';

export const AuthInfo = (props: any) => {
    const lightMode = useLightMode();
    const navigate = useNavigate();

    return (
        <div {...props}>
            <div className='flex gap-4'>
                <div className={`cursor-pointer transition-all duration-150 text-xl hover:text-blue-700 \
                    ${lightMode ? 'text-gray-900' : 'text-white'}`} onClick={() => navigate('auth/login')}>Log in</div>
                <div className={`cursor-pointer transition-all duration-150 text-xl hover:text-blue-700 \
                    ${lightMode ? 'text-gray-900' : 'text-white'}`} onClick={() => navigate('auth/signup')}>Sign up</div>
            </div>
        </div>
    )
}

export default AuthInfo;