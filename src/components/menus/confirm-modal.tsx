import { Dialog } from '@headlessui/react';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import Modal from './modal';

type ConfirmModalProps = {
    isOpen: boolean,
    title: string,
    message: string,
    confirm: string,
    onConfirm: () => void,
    onCancel: () => void,
}

export default function ConfirmModal({ title, message, confirm, isOpen, onConfirm, onCancel }: ConfirmModalProps) {
    return <Modal isOpen={isOpen} close={onCancel} classSize="w-full max-w-sm">
        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 transition">{title}</Dialog.Title>

        <Dialog.Description className="text-gray-600 dark:text-gray-300">{message}</Dialog.Description>

        <div class="row space-x-2">
            <button onClick={onCancel}
                className="w-full col text-center font-semibold py-2 px-4 border border-transparent shadow-sm rounded-md text-gray-700 dark:text-gray-300 transition bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 focus-ring">
                Cancel
            </button>
            <button type="submit" onClick={onConfirm}
                className="w-full col text-center font-semibold py-2 px-4 border border-transparent shadow-sm rounded-md text-white bg-red-400 hover:bg-red-500 focus-ring">
                {confirm}
            </button>
        </div>
    </Modal>
}

type PartialConfirmModalProps = Pick<ConfirmModalProps, 'isOpen' | 'onConfirm' | 'onCancel'>

export function useConfirmModalState(_onConfirm: () => void): [() => void, PartialConfirmModalProps] {
    const [isOpen, setIsOpen] = useState(false)
    const open = () => setIsOpen(true), close = () => setIsOpen(false)
    const onConfirm = () => { _onConfirm(); close() }
    return [open, { isOpen, onConfirm, onCancel: close }]
}
