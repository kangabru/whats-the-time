import { Dialog } from '@headlessui/react';
import { DateTime } from 'luxon';
import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import useAppState from '../../utils/store';
import { Location } from '../../utils/types';
import { join } from '../../utils/utils';
import { SelectorStyle } from '../selectors/selector';
import TimezoneSelector, { useTimezoneOptionArgs } from '../selectors/timezone';
import Modal from './modal';

/**
 * Renders the create/edit timezone modal.
 * @see https://headlessui.dev/react/modal
 */
export default function EditTimezone({ isOpen, close, location }: { isOpen: boolean, close: () => void, location?: Location }) {
    const setLocation = useAppState(s => s.setLocation)

    const [notes, setNotes] = useState(location?.notes ?? "")

    const selectorArgs = useTimezoneOptionArgs(location?.timezone)
    const timezone = selectorArgs.value.timezone

    const isValidNotes = !!notes
    const isValidZone = useMemo(() => DateTime.now().setZone(timezone).isValid, [timezone])
    const isValid = isValidNotes && isValidZone

    const onClick = () => {
        isValid && setLocation({ notes, timezone }, location)
        close()
    }

    return <Modal isOpen={isOpen} close={close} classSize='w-full max-w-sm'>

        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            {!!location ? "Edit" : "Add"} timezone
        </Dialog.Title>

        {/* Notes and timezone fields */}
        <div class="bg-white dark:bg-gray-900 space-y-2">
            <div class="space-y-1">
                <label htmlFor="names" class="block text-sm font-medium text-gray-700 dark:text-white">Notes</label>
                <input type="text" value={notes} onInput={e => setNotes(e.currentTarget.value)} placeholder="Offshore Team"
                    class={join(
                        "block w-full dark:bg-gray-700 border-gray-300 rounded-lg shadow-sm text-sm",
                        "focus-ring focus:border-white",
                    )} />
            </div>

            <div class="space-y-1">
                <div class="block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</div>
                <TimezoneSelector {...selectorArgs} style={SelectorStyle.Field} classSize='w-full' />
            </div>
        </div>

        {/* Save */}
        <div class="flex justify-end">
            <button type="submit" onClick={onClick} disabled={!isValid}
                className={join(
                    "font-semibold py-2 px-4 border border-transparent shadow-sm text-sm rounded-md text-white bg-indigo-400 hover:bg-indigo-500 focus-ring",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                )}>
                Save
            </button>
        </div>
    </Modal>
}
