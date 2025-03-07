import { MonateIcon } from '@app/components';
import { Home, Portfolios, Login, ComfyUI, SignUp, RePassword, Information, UploadPortfolio, Chatbot, BookMe, Bookers, Followers } from '@app/pages';

const icon = {
    className: 'w-5 h-5 text-inherit',
};

export const routes = [
    {
        layout: '/',
        pages: [
            {
                icon: <MonateIcon {...icon} />,
                name: 'home',
                label: 'Home',
                path: '',
                element: <Home />,
            },
        ],
    },
    {
        layout: '/auth',
        pages: [
            {
                icon: <MonateIcon {...icon} />,
                name: 'login',
                label: 'Login',
                path: '/login',
                element: <Login />,
            },
            {
                icon: <MonateIcon {...icon} />,
                name: 'signUp',
                label: 'SignUp',
                path: '/signup',
                element: <SignUp />,
            },
            {
                icon: <MonateIcon {...icon} />,
                name: 'rePwd',
                label: 'RePassword',
                path: '/re-pwd',
                element: <RePassword />,
            },
        ],
    },
    {
        layout: '/user',
        pages: [
            {
                icon: <MonateIcon {...icon} />,
                name: 'information',
                label: 'Information',
                path: '/info',
                element: <Information />,
            }
        ]
    },
    {
        layout: '/admin',
        pages: [
            {
                icon: <MonateIcon {...icon} />,
                name: 'bookers',
                label: 'Bookers',
                path: '/bookers',
                element: <Bookers />,
            },
            {
                icon: <MonateIcon {...icon} />,
                name: 'followers',
                label: 'Followers',
                path: '/followers',
                element: <Followers />,
            },
            {
                icon: <MonateIcon {...icon} />,
                name: 'settings',
                label: 'Settings',
                path: '/settings',
                element: <Bookers />,
            },
            {
                icon: <MonateIcon {...icon} />,
                name: 'manage-users',
                label: 'Manage Users',
                path: '/users',
                element: <Bookers />,
            },
        ],
    },
    {
        layout: '/team',
        pages: [
            {
                icon: <div />,
                name: 'upload-portfolio',
                label: 'Upload Portfolio',
                path: '/upload-portfolio',
                element: <UploadPortfolio />,
            }
        ],
    },
    {
        layout: '/client',
        pages: [
            {
                icon: <div />,
                name: 'portfolios',
                label: 'Portfolios',
                path: '/portfolios',
                element: <Portfolios />,
            },
            {
                icon: <div />,
                name: 'chatbot',
                label: 'Chatbot',
                path: '/chatbot',
                element: <Chatbot />,
            },
            {
                icon: <div />,
                name: 'comfyui',
                label: 'ComfyUI API',
                path: '/comfyui',
                element: <ComfyUI />,
            },
        ]
    },
    {
        layout: '/contact',
        pages: [
            {
                icon: <div />,
                name: 'book-me',
                label: 'Book me',
                path: '/book-me',
                element: <BookMe />,
            },
        ]
    },
];

export default routes;