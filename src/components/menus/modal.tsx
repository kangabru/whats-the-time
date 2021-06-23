import { Dialog, Transition } from '@headlessui/react';
import { Fragment, h } from 'preact';
import { Children } from '../../utils/types';

export default function Modal({ isOpen, close, children }: Children & { isOpen: boolean, close: () => void }) {
    return <Transition appear show={isOpen} as={Fragment}>
        <Dialog
            as="div"
            className="fixed inset-0 z-10"
            onClose={close}
        >
            <div className="col justify-center min-h-screen px-4 text-center">
                <Transition.Child
                    as='div'
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-25" />
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
                    <div className="inline-block w-full max-w-md p-6 my-8 space-y-4 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                        {children}
                    </div>
                </Transition.Child>
            </div>
        </Dialog>
    </Transition>
}
