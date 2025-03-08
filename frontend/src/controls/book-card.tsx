import { useState } from 'react';
import { FormCancelButton1, FormHeader1, FormSubmitButton1, FormTextField1, FormTextField3 } from '@app/components';
import { BookCardProps } from '@app/types';

export const BookCard = (props: BookCardProps) => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSubmit = (event: React.MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.onSubmit({
            name,
            email,
            message,
            checked: false,
        });
    };

    return (
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <FormHeader1>
                    Book me
                </FormHeader1>
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
                    label="Message"
                    type="message"
                    name="message"
                    id="message"
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                    placeholder="Input message here..."
                    required
                />
                <div className='w-full flex flex-row gap-2'>
                    <FormSubmitButton1
                        submitting={props.booking}
                    >
                        Book me
                    </FormSubmitButton1>
                    <FormCancelButton1
                        onCancel={props.onCancel}
                    >
                        Cancel
                    </FormCancelButton1>
                </div>
            </form>
        </div>
    )
}

export default BookCard;