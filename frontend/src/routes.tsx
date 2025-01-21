import {
    HomeIcon,
} from '@heroicons/react/24/solid';

import { MonateIcon } from '@app/components';
import { Preface, Home, Portfolios, Login, SignUp } from '@app/pages';

const icon = {
    className: 'w-5 h-5 text-inherit',
};

export const routes = [
    {
        layout: '',
        pages: [
            {
                icon: <MonateIcon {...icon} />,
                name: 'preface',
                label: 'Preface',
                path: '/',
                element: <Preface />,
            },
            {
                icon: <HomeIcon {...icon} />,
                name: 'home',
                label: 'Home',
                path: '/home',
                element: <Home />,
            },
        ],
    },
    {
        layout: 'auth',
        pages: [
            {
                icon: <MonateIcon {...icon} />,
                name: 'preface',
                label: 'Preface',
                path: '/login',
                element: <Login />,
            },
            {
                icon: <MonateIcon {...icon} />,
                name: 'preface',
                label: 'Preface',
                path: '/signup',
                element: <SignUp />,
            },
        ],
    },
    {
        layout: 'admin',
        pages: [
        ],
    },
    {
        layout: 'member',
        pages: [
        ],
    },
    {
        layout: 'client',
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
                name: 'full-stack',
                label: 'Full Stack',
                path: '/full-stack',
                element: <div />,
            },
            {
                icon: <div />,
                name: 'gen-ai',
                label: 'Generative AI',
                path: '/gen-ai',
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
        layout: 'contact',
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