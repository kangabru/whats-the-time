import { Dialog } from '@headlessui/react';
import { LocationMarkerIcon } from '@heroicons/react/solid';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import useAppState from '../../utils/store';
import Selector, { SelectorStyle } from '../selectors/selector';
import { TimezoneOption, useTimezoneOption, useTimezoneOptions } from '../selectors/timezone';
import Modal from './modal';

export default function EditSettings({ isOpen, close: closeModal }: { isOpen: boolean, close: () => void }) {
    const [confirming, onClick, onClose] = useConfirm(closeModal)

    return <Modal isOpen={isOpen} close={onClose}>
        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
            Settings
        </Dialog.Title>

        <hr class="border-t" />

        <DefaultLocationSelector />

        <hr class="border-t" />

        <button type="submit" onClick={onClick}
            className="w-full max-w-xs mx-auto col text-center font-semibold py-2 px-4 border border-transparent shadow-sm rounded-md text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
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

function DefaultLocationSelector() {
    const timezone = useAppState(s => s.timezone)
    const setTimezone = useAppState(s => s.setTimezone)
    const resetTimezone = () => setTimezone(undefined)

    const options = useTimezoneOptions()
    const option = useTimezoneOption(options, timezone)

    return <div class="flex flex-col space-y-2 mx-auto">
        <div class="flex items-end space-x-2 justify-center">
            <div class="space-y-1.5">
                <p class="text-sm">Local timezone</p>
                <Selector<TimezoneOption>
                    options={options} value={option} onChange={o => setTimezone(o.timezone)}
                    style={SelectorStyle.Field} toStr={r => r.name} toKey={r => r.timezone}
                />
            </div>

            <button title="Reset timezone" onClick={resetTimezone}
                class="block p-1.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-opacity-75 focus:ring-gray focus:border-white">
                <LocationMarkerIcon class="w-6 h-6" />
            </button>
        </div>
    </div>
}