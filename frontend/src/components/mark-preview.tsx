import { useEffect, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import ReactMarkdown from "react-markdown";

export const MarkupPreviewer = (props: any) => {
    const splitMarkdown = (text: string) => {
        const regex = /(\\\[[\s\S]*?\\\])|(\\\([\s\S]*?\\\))|(```[\s\S]*?```)|(`.*?`)/g;
        const parts = [];
        let lastIndex = 0;

        text.replace(regex, (match, blockMath, inlineMath, blockCode, inlineCode, offset) => {
            if (lastIndex !== offset) {
                parts.push({ type: "markdown", content: text.slice(lastIndex, offset) });
            }

            if (blockCode) {
                parts.push({ type: "block_code", content: blockCode.slice(3, -3) });
            } else if (inlineCode) {
                parts.push({ type: "inline_code", content: inlineCode.slice(1, -1) });
            } else if (blockMath) {
                parts.push({ type: "block_math", content: blockMath.slice(2, -2) });
            } else if (inlineMath) {
                parts.push({ type: "inline_math", content: inlineMath.slice(2, -2) });
            }

            lastIndex = offset + match.length;
            return match;
        });

        if (lastIndex < text.length) {
            parts.push({ type: "markdown", content: text.slice(lastIndex) });
        }

        return parts;
    };

    const [elements, setElements] = useState<any[]>([]);

    useEffect(() => {
        const parts = splitMarkdown(props.text);
        const newElements: any[] = [];

        let inlineGroup: any[] = [];

        const flushInlineGroup = () => {
            if (inlineGroup.length > 0) {
                newElements.push(
                    <span key={newElements.length} className="flex flex-wrap items-center">
                        {inlineGroup}
                    </span>
                );
                inlineGroup = [];
            }
        };

        for (let i = 0; i < parts.length; i++) {
            switch (parts[i].type) {
                case "markdown":
                    inlineGroup.push(
                        <span key={i} className="inline-block">
                            <ReactMarkdown>{parts[i].content}</ReactMarkdown>
                        </span>
                    );
                    break;
                case "inline_math":
                    inlineGroup.push(
                        <span key={i} className="inline-block px-1">
                            <InlineMath math={parts[i].content} />
                        </span>
                    );
                    break;
                case "inline_code":
                    inlineGroup.push(
                        <code key={i} className="bg-gray-100 p-1 rounded">
                            {parts[i].content}
                        </code>
                    );
                    break;
                case "block_code":
                    flushInlineGroup();
                    newElements.push(
                        <pre key={i} className="bg-gray-900 text-white p-2 rounded my-2">
                            <code>{parts[i].content}</code>
                        </pre>
                    );
                    break;
                case "block_math":
                    flushInlineGroup();
                    newElements.push(<BlockMath key={i} math={parts[i].content} />);
                    break;
                default:
                    break;
            }
        }
        flushInlineGroup();
        setElements(newElements);
    }, [props.text]);

    useEffect(() => {
        document.querySelectorAll(".katex .katex-html").forEach((el: any) => {
            el.style.display = "none";
            el.style.visibility = "hidden";
        });
    }, [elements]);

    return (
        <div className="w-full h-96 p-4 border rounded-lg shadow overflow-auto bg-white">
            {elements}
        </div>
    );
};

export default MarkupPreviewer;
