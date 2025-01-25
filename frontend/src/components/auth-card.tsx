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

        if (props.signUp && password !== rePassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        
        const formData = {
            email,
            password,
            rePassword: props.signUp ? rePassword : undefined,
            rememberMe,
        };
        
        props.onSubmit(formData);
    };

    return (
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                    {props.signUp ? 'Sign up' : 'Login'} to MONATE
                </h5>
                {error && (
                    <div className="p-2 mb-4 text-sm text-red-800 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                        {error}
                    </div>
                )}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="name@company.com"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                    />
                </div>
                {props.signUp && (
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Retype password
                        </label>
                        <input
                            type="password"
                            name="re-password"
                            id="re-password"
                            value={rePassword}
                            onChange={(e) => setRePassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
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
                    {!props.signUp && (
                        <button type='button'
                            onClick={() => redirect("/auth/re-pwd")}
                            className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
                        >
                            Forgot Password?
                        </button>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    {props.signUp ? 'Sign up' : 'Login'} to your account
                </button>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    {props.signUp ? 'Already registered?' : 'Not registered?'}{' '}
                    <button type='button'
                        onClick={() => redirect(props.signUp ? '/auth/login' : '/auth/signup')}
                        className="text-blue-700 hover:underline dark:text-blue-500"
                    >
                        {props.signUp ? 'Go to login' : 'Create account'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AuthCard;