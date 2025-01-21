import { useLightMode } from '@app/global';
import { useRedirectionHelper } from '@app/helpers';

export const AuthInfo = (props: any) => {
    const lightMode = useLightMode();
    const redirect = useRedirectionHelper();

    return (
        <div {...props}>
            <div className='flex gap-4'>
                <div className={`cursor-pointer transition-all duration-150 text-xl hover:text-blue-700 \
                    ${lightMode ? 'text-gray-900' : 'text-white'}`} onClick={() => redirect('auth/login')}>Log in</div>
                <div className={`cursor-pointer transition-all duration-150 text-xl hover:text-blue-700 \
                    ${lightMode ? 'text-gray-900' : 'text-white'}`} onClick={() => redirect('auth/signup')}>Sign up</div>
            </div>
        </div>
    )
}

export default AuthInfo;