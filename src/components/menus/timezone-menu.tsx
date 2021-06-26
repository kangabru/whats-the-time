import { Menu, Transition } from '@headlessui/react'
import ChevronDownIcon from '@heroicons/react/solid/ChevronDownIcon'
import ChevronUpIcon from '@heroicons/react/solid/ChevronUpIcon'
import MenuIcon from '@heroicons/react/solid/MenuIcon'
import PencilIcon from '@heroicons/react/solid/PencilIcon'
import TrashIcon from '@heroicons/react/solid/TrashIcon'
import { Fragment, h, JSX, Ref } from 'preact'
import { useRelativeBounds } from '../../utils/relative-context'
import useAppState from '../../utils/store'
import { Location } from '../../utils/types'
import { join } from '../../utils/utils'
import ConfirmModal, { useConfirmModalState } from './confirm-modal'

/**
 * Renders the popup menu with actions like Edit, Move Up, Move Down, Delete.
 * @see https://headlessui.dev/react/menu
 */
export default function TimezoneMenu({ location, edit }: { location: Location, edit: () => void }) {
    const moveLocation = useAppState(s => s.moveLocation)
    const removeLocation = useAppState(s => s.removeLocation)

    const [ref, top] = useMenuPosition()
    const [confirmDelete, deleteModalProps] = useConfirmModalState(() => removeLocation(location))

    return <>
        <ConfirmModal {...deleteModalProps}
            title="Confirm delete" confirm="Delete"
            message={`This will delete timezone '${location.notes}'.`}
        />
        <Menu as="div" className="inline-block text-left">
            <Menu.Button ref={ref} title="Edit" className="flex-shrink-0 rounded focus-ring opacity-50 hover:opacity-100">
                <MenuIcon class="h-6 w-6" />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 scale-90 -translate-x-2"
                enterTo="opacity-100 scale-100 translate-x-0"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100 translate-x-0"
                leaveTo="opacity-0 scale-90 -translate-x-2"
            >
                <Menu.Items
                    style={{ '--tw-translate-y': `calc(${top}px - 50%)` }}
                    className="absolute z-20 top-0 left-14 transform w-32 bg-white origin-left divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                        <MenuButton text="Edit" onClick={edit} icon={PencilIcon} />
                    </div>
                    <div className="px-1 py-1">
                        <MenuButton text="Move up" onClick={() => moveLocation(location, true)} icon={ChevronUpIcon} />
                        <MenuButton text="Move down" onClick={() => moveLocation(location, false)} icon={ChevronDownIcon} />
                    </div>
                    <div className="px-1 py-1">
                        <MenuButton text='Delete' onClick={confirmDelete} icon={TrashIcon} class="text-red-600" classActive="bg-red-100 underline" />
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    </>
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
            <button title={text} onClick={onClick} class={join(
                cls, 'group flex rounded-md items-center w-full px-2 py-2 text-sm focus-ring',
                active && (classActive ?? 'bg-gray-100 underline'),
            )}>
                {icon({ className: "w-5 h-5 mr-2", ariaHidden: true })}
                {text}
            </button>
        )}
    </Menu.Item>
}

/**
 * This modal must render outside of the table bounds but to do that we need to make use
 * of the relative root and position the element via JS instead of CSS.
 * @returns [The ref to use on the button to anchor the menu to, the top offset to position the menu to.]
 */
function useMenuPosition(): [Ref<HTMLElement>, number] {
    const [ref, { y, height }] = useRelativeBounds()
    const top = y + height / 2
    return [ref, top]
}