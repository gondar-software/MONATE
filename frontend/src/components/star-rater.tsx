import { StarRaterProps } from '@app/types';
import { useState } from 'react';

export const StarRater = (props: StarRaterProps) => {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const handleClick = (index: number) => {
        props.setRating(index + 1);
    };

    const handleMouseEnter = (index: number) => {
        setHoverRating(index + 1);
    };

    const handleMouseLeave = () => {
        setHoverRating(null);
    };

    return (
        <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }, (_, index) => (
                <svg
                    key={index}
                    className={`w-8 h-8 cursor-pointer transition-transform duration-200 ${
                        (hoverRating || props.rating) > index ? "text-yellow-500 scale-110" : "text-gray-300"
                    }`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    onClick={() => handleClick(index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                >
                    <path d="M12 2l2.9 6.5 7.1.6-5.4 4.8 1.6 7-6.2-3.5-6.2 3.5 1.6-7-5.4-4.8 7.1-.6L12 2z" />
                </svg>
            ))}
        </div>
    );
};

export default StarRater;