import { FormLinkButton2 } from "@app/components"
import { RagDoc, RagDocProps } from "@app/types"

export const RagDocPreviewer = (props: RagDocProps) => {
    return (
        <div className="w-full px-6 flex flex-col gap-4">
            {props.doc.map((doc: RagDoc, index: number) => (
                <div key={index} className="flex w-full flex-col gap-2">
                    <FormLinkButton2 url={doc.link}>{doc.title}</FormLinkButton2>
                    <div className="text-sm text-gray-500 px-2 dark:text-gray-400">
                        {doc.snippet}
                    </div>
                </div>
            ))}
        </div>
    )
}