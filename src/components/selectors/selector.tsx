import { Listbox, Transition } from '@headlessui/react';
import CheckIcon from '@heroicons/react/solid/CheckIcon';
import GlobeIcon from '@heroicons/react/solid/GlobeIcon';
import SelectorIcon from '@heroicons/react/solid/SelectorIcon';
import { Fragment, h } from 'preact';
import { join } from '../../utils/utils';

export type Selectable<T> = T & { disabled?: boolean }

export type SelectorProps<T> = {
    value: Selectable<T>,
    options: Selectable<T>[],
    onChange: (value: T) => void,
    style?: SelectorStyle,
    toStr: (value: T) => string,
    toKey: (value: T) => string,
    classSize?: string,
}

export enum SelectorStyle { Raised, Field, DashboardTime }

/** A generic listbox used to show a list of item.
 * @see https://headlessui.dev/react/listbox
 */
export default function Selector<T>({ value, options, onChange, style, classSize, toStr, toKey }: SelectorProps<T>) {
    return <Listbox value={value} onChange={onChange}>
        <div class={join("relative text-left", classSize ?? 'w-full sm:w-64')}>

            <Listbox.Button className={join(
                "group relative w-full py-2 pl-3 pr-10 rounded-lg cursor-default focus-ring",
                (style === SelectorStyle.Raised || style === undefined) && "shadow-md focus:border-gray-500",
                style === SelectorStyle.Field && "border border-gray-300 shadow-sm focus:border-white",
                style === SelectorStyle.DashboardTime
                    ? "hover:bg-white focus:bg-white dark:bg-gray-800 dark:hover:bg-gray-600 dark:focus:bg-gray-600 text-center"
                    : "bg-white dark:bg-gray-700 text-left",
            )}>
                <span class="block truncate">{toStr(value)}</span>
                <span class={join(
                    "absolute inset-y-0 right-0 pr-2 items-center pointer-events-none",
                    style === SelectorStyle.DashboardTime ? "hidden group-focus:flex group-hover:flex" : "flex",
                )}>
                    <SelectorIcon
                        className="w-5 h-5 text-gray-400 dark:text-gray-200"
                        aria-hidden="true"
                    />
                </span>
            </Listbox.Button>

            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Listbox.Options className={join(
                    "absolute z-10 mt-1 overflow-auto bg-white dark:bg-gray-700 rounded-md shadow-lg max-h-60 ring-1 ring-gray ring-opacity-5 focus:outline-none",
                    style === SelectorStyle.DashboardTime ? "w-40" : "w-full",
                )}>
                    {options.map(option => (
                        <Listbox.Option key={toKey(option)} value={option} disabled={option.disabled}
                            className={({ active, disabled }) => join(
                                'cursor-default select-none relative pl-10 pr-4',
                                active ? 'text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-100',
                                disabled ? 'bg-indigo-100 dark:bg-indigo-900 text-white sticky top-0 z-10 py-1' : 'py-2',
                            )}>
                            {/* @ts-ignore */}
                            {({ selected, disabled }) => (
                                <>
                                    <span class={join(
                                        'block truncate font-normal',
                                        selected && 'font-semibold',
                                        disabled && 'font-semibold uppercase',
                                    )}>
                                        {toStr(option)}
                                    </span>
                                    {selected
                                        ? <span class='absolute inset-y-0 left-0 flex items-center pl-3'>
                                            <CheckIcon class="w-5 h-5" aria-hidden="true" />
                                        </span>
                                        : disabled
                                            ? <span class='absolute inset-y-0 left-0 flex items-center pl-3'>
                                                <GlobeIcon class="w-4 h-4" aria-hidden="true" />
                                            </span>
                                            : null}
                                </>
                            )}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Transition>

        </div>
    </Listbox>
}
