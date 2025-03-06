import { useState } from 'react';
import { FormHeader1, FormSubmitButton1, FormTextField1, FormTextField3 } from '@app/components';

export const BookCard = (props: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event: any) => {
        event.preventDefault();
        props.onSubmit({
            name,
            email,
            message,
        });
    };

    return (
        <div className="w-full max-w-sm p-4 mt-32 mb-32 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
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
                    onChange={(e: any) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                />
                <FormTextField1
                    label="Email Address"
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    placeholder="monate@example.com"
                    required
                />
                <FormTextField3
                    label="Message"
                    type="message"
                    name="message"
                    id="message"
                    value={message}
                    onChange={(e: any) => setMessage(e.target.value)}
                    placeholder="Input message here..."
                    required
                />
                <FormSubmitButton1
                    submitting={props.booking}
                >
                    Book me
                </FormSubmitButton1>
            </form>
        </div>
    )
}

export default BookCard;