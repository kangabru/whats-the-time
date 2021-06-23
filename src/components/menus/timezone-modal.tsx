import { Dialog } from '@headlessui/react';
import { DateTime } from 'luxon';
import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import useAppState from '../../utils/store';
import { Location } from '../../utils/types';
import { join } from '../../utils/utils';
import { SelectorStyle } from '../selectors/selector';
import useTimezoneSelector from '../selectors/timezone';
import Modal from './modal';

export default function EditTimezone({ isOpen, close, location }: { isOpen: boolean, close: () => void, location?: Location }) {
    const setLocation = useAppState(s => s.setLocation)

    const [notes, setNotes] = useState(location?.notes ?? "")
    const [selectorTimezone, { timezone }] = useTimezoneSelector(location?.timezone, SelectorStyle.Field)

    const isValidNotes = !!notes
    const isValidZone = useMemo(() => DateTime.now().setZone(timezone).isValid, [timezone])
    const isValid = isValidNotes && isValidZone

    const onClick = () => {
        isValid && setLocation({ notes, timezone }, location)
        close()
    }

    return <Modal isOpen={isOpen} close={close}>
        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
            {!!location ? "Edit" : "Create"} timezone
        </Dialog.Title>

        <div class="row justify-evenly bg-white space-x-3">
            <div class="w-full max-w-xxs space-y-1">
                <label htmlFor="names" class="block text-sm font-medium text-gray-700">Notes</label>
                <input type="text" value={notes} onInput={e => setNotes(e.currentTarget.value)} placeholder="Offshore Team"
                    class={join(
                        "block w-full border-gray-300 rounded-lg shadow-sm text-sm",
                        "focus:outline-none focus:ring-2 focus:ring-opacity-75 focus:ring-gray focus:border-white",
                    )} />
            </div>

            <div class="w-full max-w-xxs space-y-1">
                <div class="block text-sm font-medium text-gray-700">Timezone</div>
                {selectorTimezone}
            </div>
        </div>

        <button type="submit" onClick={onClick}
            className={join(
                "font-semibold py-2 px-4 border border-transparent shadow-sm text-sm rounded-md text-white bg-indigo-400 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
                !isValid && "opacity-50 cursor-not-allowed",
            )}>
            Save
        </button>
    </Modal>
}
