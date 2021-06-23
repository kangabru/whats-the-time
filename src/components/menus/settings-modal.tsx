import { Dialog } from '@headlessui/react';
import { h } from 'preact';
import { join } from '../../utils/utils';
import Modal from './modal';

export default function EditSettings({ isOpen, close }: { isOpen: boolean, close: () => void }) {

    return <Modal isOpen={isOpen} close={close}>
        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
            Settings
        </Dialog.Title>

        <button type="submit"
            className={join(
                "w-full font-semibold py-2 px-4 border border-transparent shadow-sm text-sm rounded-md text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
            )}>
            Reset
        </button>
    </Modal>
}
