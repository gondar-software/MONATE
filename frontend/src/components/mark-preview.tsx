import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export const MarkupPreviewer = (props: any) => {
    return (
        <div className={`h-full px-6 py-2 border rounded-lg w-full 
            ${props.user ? 'bg-gray-200 shadow-sm dark:bg-gray-700 dark:border-gray-500 text-gray-900 dark:text-white' :
                'bg-white shadow-sm dark:bg-gray-800 dark:border-gray-500 text-gray-900 dark:text-white'}`}>
            <ReactMarkdown
                children={props.text}
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                className="prose"
            />
        </div>
    );
}
