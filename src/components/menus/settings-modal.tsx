import { Dialog } from '@headlessui/react';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import useAppState from '../../utils/store';
import Modal from './modal';

export default function EditSettings({ isOpen, close: closeModal }: { isOpen: boolean, close: () => void }) {
    const [confirming, onClick, onClose] = useConfirm(closeModal)

    return <Modal isOpen={isOpen} close={onClose}>
        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
            Settings
        </Dialog.Title>


        <button type="submit" onClick={onClick}
            className="w-full col text-center font-semibold py-2 px-4 border border-transparent shadow-sm rounded-md text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            <span>{confirming ? "Are you sure?" : "Reset"}</span>
            {confirming && <span class="text-sm opacity-80">This will delete all app data</span>}
        </button>
    </Modal>
}

function useConfirm(closeModal: () => void): [boolean, () => void, () => void] {
    const reset = useAppState(s => s.reset)
    const [confirming, setConfirming] = useState(false)

    const onClose = () => {
        setConfirming(false)
        closeModal()
    }

    const onClick = () => {
        if (confirming) { reset(); onClose() }
        else setConfirming(true)
    }

    return [confirming, onClick, onClose]
}