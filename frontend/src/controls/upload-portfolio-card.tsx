import { useState, useEffect } from "react";
import { BadgePicker } from "@app/controls";
import { FormFileItem1, FormFileUploader1, FormHeader2, FormSelect1, FormSubmitButton1, FormTextField1 } from "@app/components";
import { useJsonCryptionMiddleware } from "@app/middlewares";
import { useToken } from "@app/global";
import { useAlert } from "@app/providers";

export const UploadPortfolioCard = (props: any) => {
    const token = useToken();
    const [title, setTitle] = useState('');
    const [portfolioType, setPortfolioType] = useState('');
    const [url, setUrl] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [slides, setSlides] = useState<any[]>([]);
    const { jsonClient } = useJsonCryptionMiddleware();
    const { addAlert } = useAlert();

    useEffect(() => {
        jsonClient.get('category',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ).then((res) => {
            setCategories(res.data.categories);
        });
    }, []);

    const handleSetFileData = (file: any, fileType: any) => {
        if (fileType === 'image' ||  fileType === 'video') {
            setSlides([...slides, { file: file, fileType: fileType }]);
        }
        else
        {
            addAlert({
                mode: 'danger',
                title: 'Error',
                message: 'File type is not correct.',
            });
        }
    }

    const deleteSlide = (index: number) => {
        setSlides(slides.filter((_, i) => i !== index));
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        props.onSubmit({
            title: title,
            type: portfolioType,
            url: url,
            categories: selectedCategories,
            slides: slides,
        });
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
                    value={title}
                    onChange={(e: any) => setTitle(e.target.value)}
                    placeholder="Portfolio Title"
                    required
                />
                <FormSelect1
                    label="Portfolio type *"
                    name="type"
                    id="type"
                    placeholder="Select your portfolio type"
                    value={portfolioType}
                    onChange={(e: any) => setPortfolioType(e.target.value)}
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
                    value={url}
                    onChange={(e: any) => setUrl(e.target.value)}
                    placeholder="https://..."
                />
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Categories
                    </label>
                    <BadgePicker 
                        badges={categories} 
                        selectedBadges={selectedCategories} 
                        setSelectedBadges={setSelectedCategories} 
                        placeholder='Input category...'
                    />
                </div>
                <div className="space-y-2 w-full">
                    {slides.map((slide: any, index: number) => (
                        <FormFileItem1
                            key={index}
                            value={slide.file.name}
                            onDelete={() => deleteSlide(index)}
                        />
                    ))}
                    <FormFileUploader1
                        label="Choose image/video"
                        setFileData={handleSetFileData}
                    />
                </div>
                <FormSubmitButton1 submitting={props.uploading}>
                    Upload Portfolio
                </FormSubmitButton1>
            </form>
        </div>
    )
}

export default UploadPortfolioCard;