import { FormHeader1, FormSubmitButton1, FormTextField2 } from '@app/components';
import { useRedirectionHelper } from '@app/helpers';
import { useState } from 'react';

export const AuthCard = (props: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const redirect = useRedirectionHelper();

    const handleSubmit = (event: any) => {
        event.preventDefault();

        if (props.mode === 'signUp' && password !== rePassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        
        const formData = {
            email,
            password,
            rememberMe,
        };
        
        props.onSubmit(formData);
    };

    return (
        <div className="w-full max-w-sm p-4 mt-32 mb-32 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <FormHeader1>
                    {props.mode === 'rePwd' ? 'Reset Password' 
                        : `${props.mode === 'signUp' ? 'Sign up' : 'Login'} to MONATE`}
                </FormHeader1>
                {error && (
                    <div className="p-2 mb-4 text-sm text-red-800 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                        {error}
                    </div>
                )}
                <FormTextField2 
                    label="Your email" 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={email} 
                    onChange={(e: any) => setEmail(e.target.value)} 
                    required
                />
                <FormTextField2 
                    label="Your password" 
                    type="password" 
                    name="password" 
                    id="password" 
                    value={password} 
                    onChange={(e: any) => setPassword(e.target.value)} 
                    required 
                />
                {props.mode !== 'login' && (
                    <FormTextField2 
                        label="Confirm password" 
                        type="password" 
                        name="re-password" 
                        id="re-password" 
                        value={rePassword} 
                        onChange={(e: any) => setRePassword(e.target.value)} 
                        required 
                    />
                )}
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="remember"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                        />
                    </div>
                    <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Remember me
                    </label>
                    {props.mode === 'login' && (
                        <button type='button'
                            onClick={() => redirect("/auth/re-pwd")}
                            className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
                        >
                            Forgot Password?
                        </button>
                    )}
                </div>
                <FormSubmitButton1 submitting={props.submitting}>
                    {props.mode === 'rePwd' ? 'Reset' : `${props.mode === 'signUp' ? 'Sign up' : 'Login'} to your account`}
                </FormSubmitButton1>
                {props.mode !== 'rePwd' && <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    {props.mode === 'signUp' ? 'Already registered?' : 'Not registered?'}{' '}
                    <button type='button'
                        onClick={() => redirect(props.mode === 'signUp' ? '/auth/login' : '/auth/signup')}
                        className="text-blue-700 hover:underline dark:text-blue-500"
                    >
                        {props.mode === 'signUp' ? 'Go to login' : 'Create account'}
                    </button>
                </div>}
            </form>
        </div>
    );
};

export default AuthCard;