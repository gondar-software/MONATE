import {
    HomeIcon,
} from '@heroicons/react/24/solid';

const icon = {
    className: 'w-5 h-5 text-inherit',
};

export const routes = [
    {
        layout: '',
        pages: [
            {
                icon: <HomeIcon {...icon} />
            }
        ]
    }
];

export default routes;