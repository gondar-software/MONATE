import { useUserInfo } from '@app/global';
import { useRedirectionHelper } from '@app/helpers';
import { Avatar, TransparentButton2 } from '@app/components';
import { dropDownMenus } from '@app/constants';

export const AuthInfo = (props: any) => {
    const redirect = useRedirectionHelper();
    const userInfo = useUserInfo();

    return (
        <div {...props}>
            {!userInfo ? <div className='flex gap-4'>
                    <TransparentButton2 onClick={() => redirect('auth/login')}>Login</TransparentButton2>
                    <TransparentButton2 onClick={() => redirect('auth/signup')}>Sign up</TransparentButton2>
                </div> : 
                <Avatar className='flex items-center'
                    info={{
                        avatar: userInfo.avatar,
                        name: userInfo.firstName,
                        location: userInfo.location,
                        email: userInfo.emailAddr,
                        menu: dropDownMenus[userInfo.type as keyof typeof dropDownMenus],
                    }}
                />}
        </div>
    )
}

export default AuthInfo;