import { useSaveVideoBackgroundMode } from "@app/global";
import { useFormNoTokenCryptionMiddleware, useJsonNoTokenCryptionMiddleware } from "@app/middlewares";
import { useHeader, useLoading } from "@app/providers";
import { useEffect, useState } from "react";
import { useAlert } from "../providers/alert-provider";
import { handleNetworkError } from "../handlers/error-handler";
import { Accordion, BookCard, FollowCard, FollowerCard } from "@app/controls";
import { StarRating } from "@app/components";
import { BookerData, FollowerData, FollowingData, FollowingMode } from "@app/types";

export const BookMe = () => {
    const saveVideoBackgroundMode = useSaveVideoBackgroundMode();
    const { hideAuthInfo } = useHeader();
    const { hideLoading, showLoading } = useLoading();
    const { jsonNoTokenClient } = useJsonNoTokenCryptionMiddleware();
    const { formNoTokenClient } = useFormNoTokenCryptionMiddleware();
    const { addAlert } = useAlert();

    const [followingData, setFollowingData] = useState<FollowingData | undefined>();
    const [followingMode, setFollowingMode] = useState<FollowingMode>();
    const [booking, setBooking] = useState<boolean>(false);
    const [following, setFollowing] = useState<boolean>(false);

    const fetchFollower = async() => {
        showLoading();
        setFollowingData(undefined);
        await jsonNoTokenClient.get('/following')
            .then((res) => {
                setFollowingData(res.data);
            }).catch((err) => {
                handleNetworkError(err, addAlert);
            }).finally(() => {
                saveVideoBackgroundMode(1);
                hideAuthInfo();
                hideLoading();
            });
    };

    const handleBook = async(bookData: BookerData) => {
        setBooking(true);
        
        await jsonNoTokenClient.post('/following/book', bookData)
            .then(() => setFollowingMode(undefined))
            .catch(err => handleNetworkError(err, addAlert))
            .finally(() => setBooking(false));
    };

    const handleFollow = async(followData: FollowerData) => {
        setFollowing(true);

        let avatarPath = '';
        if (followData.avatar)
        {
            const request = new FormData();
            request.append('image', followData.avatar);
            await formNoTokenClient.post('/upload/image', request)
                .then(res => {
                    avatarPath = res.data.filePath;
                }).catch(err => handleNetworkError(err, addAlert))
                .finally();
        }

        const follower = {
            rate: followData.rate,
            email: followData.email,
            name: followData.name,
            feedback: followData.feedback,
            avatarPath: avatarPath,
        }
        await jsonNoTokenClient.post('/following/follow', follower)
            .then(() => setFollowingMode(undefined))
            .catch(err => handleNetworkError(err, addAlert))
            .finally(() => setFollowing(false));

        await fetchFollower();
    };

    useEffect(() => {
        fetchFollower();
    }, []);
    
    return (
        <div className="fixed w-full h-full py-16 flex flex-col justify-center items-center">
            <div className="relative max-w-3xl flex md:px-2 flex-col items-center min-h-full w-full">
                <div className="h-full mt-36 p-4 pt-8 w-full shadow overflow-auto rounded-b-xl bg-white dark:bg-gray-800 dark:border dark:border-t-0 dark:border-gray-400">
                    <Accordion 
                        index={0}
                        items={[
                            {
                                header: 'Top Followers',
                                body: <Accordion
                                    index={0}
                                    items={followingData?.followers?.map((follower: FollowerData) => {
                                        return {
                                            header: follower.name,
                                            body: <FollowerCard
                                                    email={follower.email}
                                                    id={follower.id}
                                                    avatarPath={follower.avatarPath}
                                                    rate={follower.rate}
                                                    feedback={follower.feedback}
                                                />
                                        }
                                    }) ?? []}
                                />,
                            },
                            {
                                header: 'What are my experiences?',
                                body: <Accordion
                                    index={0}
                                    items={[
                                        {
                                            header: 'Web & Mobile Application Development',
                                            body: 'I have successfully designed, developed, and deployed over 20 large-scale web and mobile applications for various industries, including e-commerce, finance, healthcare, logistics, and SaaS platforms. My expertise covers full-stack development, from frontend UI/UX design to backend architecture and database management.',
                                        },
                                        {
                                            header: 'Database Architecture & Optimization',
                                            body: 'I specialize in designing highly scalable, fault-tolerant, and high-performance database architectures for modern applications. My expertise includes SQL (Relational Databases) and NoSQL (Non-Relational Databases) to ensure the best combination of consistency, scalability, and speed.',
                                        },
                                        {
                                            header: 'Chatbot Development',
                                            body: 'I have extensive experience in developing AI-driven chatbots for multiple industries, integrating NLP (Natural Language Processing), machine learning, and custom AI models. I have built conversational AI agents using both proprietary APIs (OpenAI, Google Dialogflow, Rasa) and custom AI-driven chatbot frameworks.',
                                        },
                                        {
                                            header: 'Generative AI',
                                            body: 'I have expertise in building, fine-tuning, and deploying generative AI models for image, video, and text generation. My work includes developing custom pipelines for AI model training and inference using ComfyUI and open-source deep-learning frameworks.',
                                        },
                                    ]}
                                />,
                            },
                            {
                                header: 'What are my stacks?',
                                body: <Accordion
                                    index={0}
                                    items={[
                                        {
                                            header: 'Frontend',
                                            body: 'React, Flutter, Vue, Angular, Next, React-Native, ...',
                                        },
                                        {
                                            header: 'Backend',
                                            body: 'ASP.NET, Django, FastAPI, Flask, Laravel, Node, Spring, Nest, Express, ...',
                                        },
                                        {
                                            header: 'Database',
                                            body: 'PostgreSQL, Superbase, Firebase, Oracle, MySQL, MariaDB, MongoDB, Redis, Elasticsearch, VectorDB, ...',
                                        },
                                        {
                                            header: 'DevOps',
                                            body: 'GitHub/GitLab Actions, Terraform, EC2, S3, Docker, Kubernets, Azure, GCP, Llambda, Nginx, Ngrok, Apach, ...',
                                        },
                                        {
                                            header: 'Chatbot',
                                            body: 'OpenAI, DeepSeek, Qwen, Claude, Gemini, LlaMA, ...',
                                        },
                                        {
                                            header: 'Generative AI',
                                            body: 'Stable Diffusion, SDXL, Flux, Midjourney, DALL-E, Gen-3, ...',
                                        },
                                        {
                                            header: 'Automation',
                                            body: 'Make.com, n8n.io, ...',
                                        },
                                        {
                                            header: 'Team work & communication',
                                            body: 'Agile Software Development, Scrum, Kanban, Slack, Jira, ...',
                                        },
                                    ]}
                                />,
                            },
                        ]}
                    />
                </div>
                <div className="absolute w-full h-40 gap-2 shadow-lg sm:justify-between justify-center flex sm:flex-row flex-col items-start sm:items-center rounded-lg bg-white dark:bg-gray-800 dark:border dark:border-b-0 dark:border-gray-400">
                    <div className="ml-8 text-lg items-center text-gray-900 dark:text-white">
                        Reviews: &nbsp;{followingData?.rate}<span className="text-sm">{` (${followingData?.count} followers)`}</span>
                        <StarRating rating={followingData?.rate ?? 0} />
                    </div>
                    <div className="flex gap-3 mr-8 ml-8 sm:ml-0">
                        <button
                            type='button'
                            onClick={(() => setFollowingMode('book'))}
                            className='w-32 h-10 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white font-bold ml-auto'
                        >
                            Book me
                        </button>
                        <button
                            type='button'
                            onClick={(() => setFollowingMode('follow'))}
                            className='w-32 h-10 rounded-lg bg-green-500 hover:bg-green-600 transition-colors duration-300 text-white font-bold ml-auto'
                        >
                            Follow
                        </button>
                    </div>
                </div>
            </div>
            {followingMode === 'follow' && <div className="fixed w-full py-14 bg-clip-padding h-full backdrop-blur-xl">
                <div className="relative w-full h-full">
                    <div className="absolute w-full h-full bg-gray-900 opacity-30" onClick={() => setFollowingMode(undefined)} />
                    <div className="absolute w-full h-full flex justify-center items-start overflow-auto">
                        <FollowCard
                            onCancel={() => setFollowingMode(undefined)}
                            following={following}
                            onSubmit={handleFollow}
                        />
                    </div>
                </div>
            </div>}
            {followingMode === 'book' && <div className="fixed w-full py-14 bg-clip-padding h-full backdrop-blur-xl">
                <div className="relative w-full h-full">
                    <div className="absolute w-full h-full bg-gray-900 opacity-30" onClick={() => setFollowingMode(undefined)} />
                    <div className="absolute w-full h-full flex justify-center items-center">
                        <BookCard
                            onCancel={() => setFollowingMode(undefined)}
                            booking={booking}
                            onSubmit={handleBook}
                        />
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default BookMe;