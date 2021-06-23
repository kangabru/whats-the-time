import { Dialog, Transition } from '@headlessui/react';
import { DateTime } from 'luxon';
import { Fragment, h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import useAppState from '../../utils/store';
import { Location } from '../../utils/types';
import { join } from '../../utils/utils';
import { SelectorStyle } from '../selectors/selector';
import useTimezoneSelector from '../selectors/timezone';

export default function EditTimezone({ isOpen, close, location }: { isOpen: boolean, close: () => void, location?: Location }) {
    const { setLocation } = useAppState()

    const [notes, setNotes] = useState(location?.notes ?? "")
    const [selectorTimezone, { timezone }] = useTimezoneSelector(location?.timezone, SelectorStyle.Field)

    const isValidNotes = !!notes
    const isValidZone = useMemo(() => DateTime.now().setZone(timezone).isValid, [timezone])
    const isValid = isValidNotes && isValidZone

    const onClick = () => {
        isValid && setLocation({ notes, timezone: timezone })
        close()
    }

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
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            {!!location ? "Edit" : "Create"} timezone
                        </Dialog.Title>

                        <div class="row justify-evenly bg-white space-x-3">
                            <div class="w-full max-w-xxs">
                                <label htmlFor="names" class="block text-sm font-medium text-gray-700">Notes</label>
                                <input type="text" value={notes} onInput={e => setNotes(e.currentTarget.value)} placeholder="Offshore Team"
                                    class={join(
                                        "block w-full mt-1 border-gray-300 rounded-lg shadow-sm sm:text-sm",
                                        "focus:outline-none focus:ring-2 focus:ring-opacity-75 focus:ring-gray focus:border-white",
                                    )} />
                            </div>

                            <div class="w-full max-w-xxs">
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
                    </div>
                </Transition.Child>
            </div>
        </Dialog>
    </Transition>
}
