import {
    HomeIcon,
} from '@heroicons/react/24/solid';

import { MonateIcon } from '@app/components';
import { Preface, Home } from '@app/pages';

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
                path: '/',
                element: <Preface />,
            },
            {
                icon: <HomeIcon {...icon} />,
                name: 'home',
                path: '/home',
                element: <Home />,
            },
        ],
    },
    {
        layout: 'auth',
        pages: [
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
];

export default routes;