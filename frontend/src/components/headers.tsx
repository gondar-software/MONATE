import { FormHeader1Props, FormHeader2Props, FormHeader3Props } from "@app/types"

export const FormHeader1 = (props: FormHeader1Props) => {
    return (
        <h5 className="text-xl font-medium text-gray-900 dark:text-white">
            {props.children}
        </h5>
    )
}

export const FormHeader2 = (props: FormHeader2Props) => {
    return (
        <h5 className="text-3xl font-medium text-gray-900 dark:text-white">
            {props.children}
        </h5>
    )
}

export const FormHeader3 = (props: FormHeader3Props) => {
    return (
        <h5 className="text-xl w-full truncate font-medium text-gray-900 dark:text-white">
            {props.children}
        </h5>
    )
}