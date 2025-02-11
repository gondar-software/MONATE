import {
    HomeIcon,
} from '@heroicons/react/24/solid';

import { MonateIcon } from '@app/components';
import { Preface, Home, Portfolios, Login, SignUp, RePassword, Information, UploadPortfolio, Chatbot } from '@app/pages';

const icon = {
    className: 'w-5 h-5 text-inherit',
};

export const routes = [
    {
        layout: '/',
        pages: [
            {
                icon: <MonateIcon {...icon} />,
                name: 'preface',
                label: 'Preface',
                path: '',
                element: <Preface />,
            },
            {
                icon: <HomeIcon {...icon} />,
                name: 'home',
                label: 'Home',
                path: 'home',
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
                name: 'automation',
                label: 'Automation',
                path: '/automation',
                element: <div />,
            },
            {
                icon: <div />,
                name: 'cv',
                label: 'Computer Vision',
                path: '/cv',
                element: <div />,
            },
            {
                icon: <div />,
                name: 'about-us',
                label: 'About Us',
                path: '/about-us',
                element: <div />,
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
                element: <div />,
            },
        ]
    },
];

export default routes;