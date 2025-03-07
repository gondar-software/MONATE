import { AccordionItemData, AccordionItemProps, AccordionProps } from "@app/types";
import { useState, useEffect, useRef } from "react";

export const Accordion = (props: AccordionProps) => {
    const [openIndex, setOpenIndex] = useState<number | undefined>(0);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? undefined : index);
    };

    useEffect(() => {
        if (props.index !== undefined)
            setOpenIndex(props.index);
        else
            setOpenIndex(props.items.length - 1);
    }, [props.items.length]);

    useEffect(() => {
        if (props.index !== undefined)
            setOpenIndex(props.index);
    }, [props.index]);

    return (
        <div className={props.className}>
            <div data-accordion="collapse" className="rounded-lg w-full">
                {props.items.map((item: AccordionItemData, index: number) => (
                    <AccordionItem
                        key={index}
                        header={item.header}
                        body={item.body}
                        id={crypto.randomUUID()}
                        isOpen={openIndex === index}
                        toggle={() => toggleItem(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export const AccordionItem = (props: AccordionItemProps) => {
    const [height, setHeight] = useState("0px");
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateHeight = () => {
            if (props.isOpen && contentRef.current) {
                setHeight(`${contentRef.current.scrollHeight}px`);
            } else {
                setHeight("0px");
            }
        };

        const observer = new ResizeObserver(updateHeight);

        if (contentRef.current) {
            observer.observe(contentRef.current);
        }

        updateHeight();

        return () => observer.disconnect();
    }, [props.isOpen]);

    return (
        <div>
            <h2 id={`accordion-collapse-heading-${props.id}`}>
                <button
                    type="button"
                    className={`flex items-center transition-colors duration-300 justify-between w-full p-2 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 ${
                        props.isOpen ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" : ""
                    }`}
                    data-accordion-target={`#accordion-collapse-body-${props.id}`}
                    aria-expanded={props.isOpen}
                    aria-controls={`accordion-collapse-body-${props.id}`}
                    onClick={props.toggle}
                >
                    <span>{props.header}</span>
                    <svg
                        data-accordion-icon
                        className={`w-3 h-3 mr-4 shrink-0 ${props.isOpen ? "rotate-180" : ""} transition-transform duration-300`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5 5 1 1 5"
                        />
                    </svg>
                </button>
            </h2>
            <div
                id={`accordion-collapse-body-${props.id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out`}
                style={{ maxHeight: height }}
                aria-labelledby={`accordion-collapse-heading-${props.id}`}
            >
                <div ref={contentRef} className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    {props.body}
                </div>
            </div>
        </div>
    );
};

export default Accordion;
