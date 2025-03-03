export const FormTextField1 = (props: any) => {
    return (
        <div>
            {props.label && <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {`${props.label}${props.required ? ' *' : ''}`}
            </label>}
            <input
                type={props.type}
                name={props.name}
                id={props.id}
                value={props.value}
                onChange={props.onChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder={props.placeholder}
                required={props.required}
            />
        </div>
    )
}

export const FormTextField2 = (props: any) => {
    return (
        <div>
            {props.label && <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {props.label}
            </label>}
            <input
                type={props.type}
                name={props.name}
                id={props.id}
                value={props.value}
                onChange={props.onChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder={props.placeholder}
                required={props.required}
            />
        </div>
    )
}
