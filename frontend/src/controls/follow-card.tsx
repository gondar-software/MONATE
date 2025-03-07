import { useState } from 'react';
import { FormHeader1, FormSubmitButton1, FormTextField1, FormTextField3, ImageUploader, StarRater } from '@app/components';
import { FollowCardProps } from '@app/types';

export const FollowCard = (props: FollowCardProps) => {
    const [rate, setRate] = useState<number>(5);
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');
    const [avatar, setAvatar] = useState<File | undefined>(undefined);

    const handleAvatarUpload = (file: File) => {
        setAvatar(file);
    };

    const handleSubmit = (event: React.MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.onSubmit({
            rate,
            email,
            name,
            feedback,
            avatar,
        });
    };

    return (
        <div className="w-full max-w-sm p-4 mt-32 mb-32 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <FormHeader1>
                    Your information
                </FormHeader1>
                <div className='flex flex-col items-center'>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center">
                        Avatar
                    </label>
                    <ImageUploader className='w-40 h-40' maxWidth={2048} maxHeight={2048} onImageUpload={handleAvatarUpload} />
                </div>
                <div className='flex flex-col'>
                    <label className="block mb-2 text-sm w-full font-medium text-gray-900 dark:text-white">
                        Rate *
                    </label>
                    <StarRater 
                        rating={rate}
                        setRating={setRate}
                    />
                </div>
                <FormTextField1
                    label="Full Name"
                    type="name"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                />
                <FormTextField1
                    label="Email Address"
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="monate@example.com"
                    required
                />
                <FormTextField3
                    label="Feedback"
                    type="feedback"
                    name="feedback"
                    id="feedback"
                    value={feedback}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
                    placeholder="Input feedback here..."
                />
                <FormSubmitButton1
                    submitting={props.following}
                >
                    Follow
                </FormSubmitButton1>
            </form>
        </div>
    )
}

export default FollowCard;