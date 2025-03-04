import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useLightMode } from "@app/global";

export const MarkdownPreviewer = (props: any) => {
    const [text, setText] = useState("");
    const lightMode = useLightMode();

    const replaceHolder = (text: string) => {
        const regex = /(\\\[[\s\S]*?\\\])|(\\\([\s\S]*?\\\))|(```[\s\S]*?```)|(`.*?`)/g;
        let output = "";
        let lastIndex = 0;

        text.replace(regex, (match, blockMath, inlineMath, blockCode, inlineCode, offset) => {
            if (lastIndex !== offset) {
                output += text.slice(lastIndex, offset);
            }

            if (blockCode) {
                output += `\`\`\`${blockCode.slice(3, -3)}\`\`\``;
            } else if (inlineCode) {
                output += `\`${inlineCode.slice(1, -1)}\``;
            } else if (blockMath) {
                output += `$$${blockMath.slice(2, -2)}$$`;
            } else if (inlineMath) {
                output += `$${inlineMath.slice(2, -2)}$`;
            }

            lastIndex = offset + match.length;
            return match;
        });

        if (lastIndex < text.length) {
            output += text.slice(lastIndex);
        }

        return output;
    };

    useEffect(() => {
        document.querySelectorAll(".katex .katex-html").forEach((el: any) => {
            el.style.display = "none";
            el.style.visibility = "hidden";
        });
    }, [text]);

    useEffect(() => {
        setText(replaceHolder(props.text));
    }, [props.text]);

    return (
        <div className={`h-full px-6 py-2 border rounded-lg w-full flex flex-col gap-2 
            ${props.user ? 'bg-gray-200 shadow-sm dark:bg-gray-700 dark:border-gray-500 text-gray-900 dark:text-white' :
                'bg-white shadow-sm dark:bg-gray-800 dark:border-gray-500 text-gray-900 dark:text-white'}`}>
            {props.user && props.text}
            {!props.user && <ReactMarkdown
                rehypePlugins={[rehypeKatex]}
                remarkPlugins={[remarkMath, remarkGfm]}
                components={{
                    h3({ children }) {
                        return (
                            <h3 className="text-xl font-bold mt-4">
                                {children}
                            </h3>
                        );
                    },
                    code({ inlist, children, className }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inlist && match ? (
                            <SyntaxHighlighter style={lightMode ? oneLight : oneDark} language={match[1]} PreTag="div">
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        ) : (
                            <code className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-1">
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {replaceHolder(props.text)}
            </ReactMarkdown>}
        </div>
    );
};

export default MarkdownPreviewer;
