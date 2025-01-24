import { useRedirectionHelper } from '@app/helpers';

export const AuthInfo = (props: any) => {
    const redirect = useRedirectionHelper();

    return (
        <div {...props}>
            <div className='flex gap-4'>
                <button type='button' className='cursor-pointer transition-all duration-300 text-xl text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-600'
                    onClick={() => redirect('auth/login')}>Login</button>
                <button type='button' className='cursor-pointer transition-all duration-300 text-xl text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-600'
                    onClick={() => redirect('auth/signup')}>Sign up</button>
            </div>
        </div>
    )
}

export default AuthInfo;