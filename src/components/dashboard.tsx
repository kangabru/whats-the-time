import { CogIcon, PlusIcon } from '@heroicons/react/solid';
import { DateTime } from 'luxon';
import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { RelativeParent } from '../utils/relative-context';
import useAppState from '../utils/store';
import { Location } from '../utils/types';
import { join, prettyTime, prettyTimezone, useTimeUpdater } from '../utils/utils';
import EditSettings from './menus/settings-modal';
import TimezoneMenu from './menus/timezone-menu';
import EditTimezone from './menus/timezone-modal';
import { toTimeOption } from './selectors/time';

const classTdHead = "px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
const classTdHeadCenter = join(classTdHead, "text-center")
const classTdBody = "px-6 py-3.5 whitespace-nowrap text-sm text-gray-900"

export default function TimeDashboard() {
    const here = useAppState(s => s.timezone)
    const times = useAppState(s => s.times).map(toTimeOption).map(t => t.name)
    const locations = useAppState(s => s.locations)

    const [isOpenSettings, openSettings, closeSettings] = useOpenClose()
    const [isOpenCreate, openCreate, closeCreate] = useOpenClose()

    return <RelativeParent class="flex flex-col">
        <EditSettings isOpen={isOpenSettings} close={closeSettings} />
        <EditTimezone isOpen={isOpenCreate} close={closeCreate} />
        <div class="w-full sm:w-auto overflow-x-scroll sm:overflow-x-hidden px-2 py-5">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="shadow-md overflow-hidden border-b border-gray-200 rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <td scope="col" class={join(classTdHead, 'row space-x-4')}>
                                        <button title="Settings" onClick={openSettings} class="flex-shrink-0 -ml-1 rounded focus:outline-none focus:ring-2 focus:ring-gray focus:ring-opacity-75 opacity-50 hover:opacity-100">
                                            <CogIcon class="w-6 h-6" />
                                        </button>
                                        <span>Notes</span>
                                    </td>
                                    <td scope="col" class={classTdHeadCenter}>Now</td>
                                    {times.map(t => <td scope="col" class={classTdHeadCenter} key={t}>{t}</td>)}
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <LocationRow key='here' notes="Local" timezone={here} create={openCreate} />
                                {locations.map((l, i) => <LocationRow key={`${l.timezone}-${i}`} {...l} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </RelativeParent>
}

function LocationRow({ create, ...location }: Location & { create?: () => void }) {
    useTimeUpdater()
    const thereNow = DateTime.now().setZone(location.timezone)

    const times = useAppState(s => s.times)
    const thereTimes = times.map(({ hour }) => DateTime.now().set({ hour, minute: 0 }).setZone(location.timezone))

    const [editing, setCreateIsOpen] = useState(false)
    const edit = () => setCreateIsOpen(true)
    const cancel = () => setCreateIsOpen(false)

    return <tr class="bg-white rounded-lg overflow-hidden my-3">
        <EditTimezone isOpen={editing} close={cancel} location={location} />
        <td className={classTdBody}>
            <div className="flex items-center -ml-1">
                {create
                    ? <button onClick={create} class="flex-shrink-0 rounded focus:outline-none focus:ring-2 focus:ring-gray focus:ring-opacity-75 opacity-50 hover:opacity-100">
                        <PlusIcon class="w-6 h-6" />
                    </button>
                    : <TimezoneMenu location={location} edit={edit} />}
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{location.notes}</div>
                    <div class="text-sm text-gray-500">{prettyTimezone(location.timezone)}</div>
                </div>
            </div>
        </td>
        <td class={join(classTdBody, 'text-center')}>{prettyTime(thereNow)}</td>
        {thereTimes.map(t => <td class={join(classTdBody, 'text-center')} key={t}>{prettyTime(t)}</td>)}
    </tr>
}

function useOpenClose(): [boolean, () => void, () => void] {
    const [isOpen, setIsOpen] = useState(false)
    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), [])
    return [isOpen, open, close]
}
