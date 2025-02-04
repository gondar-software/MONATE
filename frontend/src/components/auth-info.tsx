import { useUserInfo } from '@app/global';
import { useRedirectionHelper } from '@app/helpers';
import { Avatar } from '@app/components';
import { dropDownMenus } from '@app/constants';

export const AuthInfo = (props: any) => {
    const redirect = useRedirectionHelper();
    const userInfo = useUserInfo();

    return (
        <div {...props}>
            {!userInfo ? <div className='flex gap-4'>
                    <button type='button' className='cursor-pointer transition-all duration-300 text-xl text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-600'
                        onClick={() => redirect('auth/login')}>Login</button>
                    <button type='button' className='cursor-pointer transition-all duration-300 text-xl text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-600'
                        onClick={() => redirect('auth/signup')}>Sign up</button>
                </div> : 
                <Avatar className='flex items-center'
                    info={{
                        avatar: userInfo.avatar,
                        name: userInfo.firstName,
                        location: userInfo.location,
                        email: userInfo.emailAddr,
                    }}
                    dropdownmenu={dropDownMenus[userInfo.type as keyof typeof dropDownMenus]}
                />}
        </div>
    )
}

export default AuthInfo;