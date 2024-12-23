import { useLightMode } from '../global/interface';

export const MonateIcon = () => {
    const lightMode = useLightMode();

    return (
        <svg
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
            fill="none">
            <g id="SVGRepo_iconCarrier">
                <path className={lightMode ? 'fill-current text-black' : 'fill-current text-white' } d="M36 18c0 9.941-8.059 18-18 18S0 27.941 0 18S8.059 0 18 0s18 8.059 18 18z"></path>
                <path className={lightMode ? 'fill-current text-white' : 'fill-current text-black' } d="M8.174 9.125c.186-1.116 1.395-2.387 3.039-2.387c1.55 0 2.76 1.116 3.101 2.232l3.659 12.278h.062L21.692 8.97c.341-1.116 1.55-2.232 3.101-2.232c1.642 0 2.852 1.271 3.039 2.387l2.883 17.302c.031.186.031.372.031.526c0 1.365-.992 2.232-2.232 2.232c-1.582 0-2.201-.713-2.418-2.17l-1.83-12.619h-.062l-3.721 12.991c-.217.744-.805 1.798-2.48 1.798c-1.674 0-2.263-1.054-2.48-1.798l-3.721-12.991h-.062l-1.83 12.62c-.217 1.457-.837 2.17-2.418 2.17c-1.24 0-2.232-.867-2.232-2.232c0-.154 0-.341.031-.526L8.174 9.125z"></path>
            </g>
        </svg>
    );
};