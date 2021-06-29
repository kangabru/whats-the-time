import { Dialog, Transition } from '@headlessui/react';
import { Fragment, h } from 'preact';
import { Children } from '../../utils/types';
import { join } from '../../utils/utils';

type ModalProps = Children & { isOpen: boolean, close: () => void, classSize?: string }

/**
 * Renders a generic modal used to show various screens in the app.
 * @see https://headlessui.dev/react/dialog
 */
export default function Modal({ isOpen, close, children, classSize }: ModalProps) {
    return <Transition appear show={isOpen} as={Fragment}>
        <Dialog
            as="div"
            className="fixed inset-0 z-10"
            onClose={close}
        >
            <div class="col justify-center min-h-screen px-4 text-center">
                <Transition.Child
                    as='div'
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-25 dark:opacity-50" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div class={join(
                        classSize ?? 'w-full max-w-md',
                        "inline-block p-6 my-8 space-y-4 text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl",
                        "border-2 border-transparent dark:border-gray-200",
                    )}>
                        {children}
                    </div>
                </Transition.Child>
            </div>
        </Dialog>
    </Transition>
}
