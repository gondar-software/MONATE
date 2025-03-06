import { FormSelect1Item, FormSelect1Props } from "@app/types"

export const FormSelect1 = (props: FormSelect1Props) => {
    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {props.label}
            </label>
            <select
                name={props.name}
                id={props.id}
                value={props.value}
                onChange={props.onChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
            >
                <option value="" disabled>
                    {props.placeholder}
                </option>
                {props.options.map((option: FormSelect1Item) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}