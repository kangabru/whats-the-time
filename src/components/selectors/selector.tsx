import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, GlobeIcon, SelectorIcon } from '@heroicons/react/solid';
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
}

export enum SelectorStyle { Raised, Field }

export default function Selector<T>({ value, options, onChange, style, toStr, toKey }: SelectorProps<T>) {
    return <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-full max-w-xxs">
            <Listbox.Button className={join(
                "relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg cursor-default sm:text-sm",
                "focus:outline-none focus:ring-2 focus:ring-opacity-75 focus:ring-gray",
                (style === SelectorStyle.Raised || style === undefined) && "shadow-md focus:border-gray-500",
                style === SelectorStyle.Field && "border border-gray-300 shadow-sm focus:border-white",
            )}>
                <span className="block truncate">{toStr(value)}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <SelectorIcon
                        className="w-5 h-5 text-gray-400"
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
                <Listbox.Options className="absolute z-10 w-full mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-gray ring-opacity-5 focus:outline-none sm:text-sm">
                    {options.map(option => (
                        <Listbox.Option key={toKey(option)} value={option} disabled={option.disabled}
                            className={({ active, disabled }) => join(
                                'cursor-default select-none relative py-2 pl-10 pr-4',
                                active ? 'text-gray-900 bg-gray-100' : 'text-gray-900',
                                disabled && 'bg-gray-200 sticky top-0 z-10',
                            )}>
                            {/* @ts-ignore */}
                            {({ selected, disabled }) => (
                                <>
                                    <span className={join(
                                        'block truncate',
                                        selected && 'font-medium',
                                        disabled && 'font-semibold uppercase',
                                    )}>
                                        {toStr(option)}
                                    </span>
                                    {selected
                                        ? <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                        </span>
                                        : disabled
                                            ? <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                                <GlobeIcon className="w-5 h-5" aria-hidden="true" />
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
