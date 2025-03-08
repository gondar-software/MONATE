import { StarRatingProps } from "@app/types";

export const StarRating = (props: StarRatingProps) => {
    const fullStars = Math.floor(props.rating);
    const hasHalfStar = props.rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center space-x-1">
            {Array(fullStars).fill(0).map((_, index) => (
                <svg key={index} className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l2.9 6.5 7.1.6-5.4 4.8 1.6 7-6.2-3.5-6.2 3.5 1.6-7-5.4-4.8 7.1-.6L12 2z"/>
                </svg>
            ))}

            {hasHalfStar && (
                <svg className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 24 24">
                    <defs>
                        <linearGradient id="half-star">
                            <stop offset="50%" stopColor="currentColor"/>
                            <stop offset="50%" stopColor="gray"/>
                        </linearGradient>
                    </defs>
                    <path fill="url(#half-star)" d="M12 2l2.9 6.5 7.1.6-5.4 4.8 1.6 7-6.2-3.5-6.2 3.5 1.6-7-5.4-4.8 7.1-.6L12 2z"/>
                </svg>
            )}

            {Array(emptyStars).fill(0).map((_, index) => (
                <svg key={index} className="w-6 h-6 text-gray-300 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l2.9 6.5 7.1.6-5.4 4.8 1.6 7-6.2-3.5-6.2 3.5 1.6-7-5.4-4.8 7.1-.6L12 2z"/>
                </svg>
            ))}
        </div>
    );
};

export default StarRating;