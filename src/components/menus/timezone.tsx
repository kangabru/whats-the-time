import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon, MenuIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid'
import { Fragment, h, JSX } from 'preact'
import { useRelativeBounds } from '../../utils/relative-context'
import useAppState from '../../utils/store'
import { Location } from '../../utils/types'
import { join } from '../../utils/utils'

export default function TimezoneMenu({ location }: { location: Location }) {
    const { moveLocation, removeLocation } = useAppState()

    const [ref, { y, height }] = useRelativeBounds()
    const dy = y + height / 2

    return <Menu as="div" className="inline-block text-left">
        {/* @ts-ignore */}
        {({ open }) => <>
            <Menu.Button ref={ref} title="Edit" className="flex-shrink-0 rounded focus:outline-none focus:ring-2 focus:ring-gray focus:ring-opacity-75 opacity-50 hover:opacity-100">
                <MenuIcon class="h-6 w-6" />
            </Menu.Button>
            <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 scale-90 -translate-x-2"
                enterTo="opacity-100 scale-100 translate-x-0"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100 translate-x-0"
                leaveTo="opacity-0 scale-90 -translate-x-2"
            >
                <Menu.Items
                    style={{ '--tw-translate-y': `calc(${dy}px - 50%)` }}
                    className="absolute z-20 top-0 left-14 transform w-32 bg-white origin-left divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                        <MenuButton text="Edit" onClick={console.log} icon={PencilIcon} />
                    </div>
                    <div className="px-1 py-1">
                        <MenuButton text="Move up" onClick={() => moveLocation(location, true)} icon={ChevronUpIcon} />
                        <MenuButton text="Move down" onClick={() => moveLocation(location, false)} icon={ChevronDownIcon} />
                    </div>
                    <div className="px-1 py-1">
                        <MenuButton text="Delete" onClick={() => removeLocation(location)} icon={TrashIcon} class="text-red-600" classActive="bg-red-100 underline" />
                    </div>
                </Menu.Items>
            </Transition>
        </>}
    </Menu>
}

type MenuButtonProps = {
    text: string, icon: (_: any) => JSX.Element,
    class?: string, classActive?: string,
    onClick: () => void,
}

function MenuButton({ text, icon, onClick, class: cls, classActive }: MenuButtonProps) {
    return <Menu.Item>
        {/* @ts-ignore */}
        {({ active }) => (
            <button onClick={onClick} class={join(
                cls, 'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                active && (classActive ?? 'bg-gray-100 underline'),
            )}>
                {icon({ className: "w-5 h-5 mr-2", ariaHidden: true })}
                {text}
            </button>
        )}
    </Menu.Item>
}