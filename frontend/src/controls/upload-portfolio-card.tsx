import { useState } from "react";
import BadgePicker from "./badge-picker";
import { FormHeader2, FormSelect1, FormSubmitButton1, FormTextField1 } from "@app/components";

const categories = [
    {
        id: 0,
        name: 'blue',
    },
    {
        id: 1,
        name: 'gray',
    },
    {
        id: 2,
        name: 'red',
    },
    {
        id: 3,
        name: 'green',
    },
    {
        id: 4,
        name: 'yellow',
    },
    {
        id: 5,
        name: 'indigo',
    },
]

export const UploadPortfolioCard = (props: any) => {
    const [selectedBadges, setSelectedBadges] = useState<any[]>([]);

    const handleSubmit = () => {

    }

    return (
        <div className="w-full max-w-6xl p-4 mt-32 mb-32 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <FormHeader2>
                    Upload Portfolio
                </FormHeader2>
                <FormTextField1
                    label="Title"
                    type="title"
                    name="title"
                    id="title"
                    placeholder="Portfolio Title"
                    required
                />
                <FormSelect1
                    label="Portfolio type *"
                    name="type"
                    id="type"
                    placeholder="Select your portfolio type"
                    options={[
                        {
                            value: 'web',
                            label: 'Web',
                        },
                        {
                            value: 'mobile',
                            label: 'Mobile',
                        },
                        {
                            value: 'workflow',
                            label: 'Workflow',
                        },
                        {
                            value: 'other',
                            label: 'Other',
                        },
                    ]}
                />
                <FormTextField1
                    label="URL"
                    type="url"
                    name="url"
                    id="url"
                    placeholder="https://..."
                />
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Categories
                    </label>
                    <BadgePicker 
                        badges={categories} 
                        selectedBadges={selectedBadges} 
                        setSelectedBadges={setSelectedBadges} 
                        placeholder='Input category...'
                    />
                </div>
                <FormSubmitButton1 submitting={props.uploading}>
                    Upload
                </FormSubmitButton1>
            </form>
        </div>
    )
}

export default UploadPortfolioCard;