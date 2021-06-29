import CogIcon from '@heroicons/react/solid/CogIcon';
import PlusIcon from '@heroicons/react/solid/PlusIcon';
import { DateTime } from 'luxon';
import { Fragment, h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { RelativeParent } from '../utils/relative-context';
import useAppState from '../utils/store';
import { Location, Time } from '../utils/types';
import { join, prettyTime, prettyTimezone, useTimeUpdater } from '../utils/utils';
import EditSettings from './menus/settings-modal';
import TimezoneMenu from './menus/timezone-menu';
import EditTimezone from './menus/timezone-modal';
import { SelectorStyle } from './selectors/selector';
import TimeSelector, { TimeOption, useFindTimeOption, useTimeOptions } from './selectors/time';

const classTdHead = "px-6 py-1 text-left text-xs font-medium text-gray-500 dark:text-white transition uppercase tracking-wider"
const classTdHeadCenter = join(classTdHead, "text-center")
const classTdBody = "px-6 py-3.5 whitespace-nowrap text-sm text-gray-900 dark:text-white transition"

/** Renders the 'dashboard' page section. */
export default function TimeDashboard() {
    const here = useAppState(s => s.timezone)
    const locations = useAppState(s => s.locations)

    const [isOpenSettings, openSettings, closeSettings] = useOpenClose()
    const [isOpenCreate, openCreate, closeCreate] = useOpenClose()

    return <>

        {/* Settings and create/edit modals */}
        <EditSettings isOpen={isOpenSettings} close={closeSettings} />
        <EditTimezone isOpen={isOpenCreate} close={closeCreate} />

        {/* The table based of the Tailwind UI template. */}
        {/** {@link RelativeParent} is used here to allow the row menu popup to render outside of the table bounds. */}
        {/* The div nesting is used to allow the table to render with rounded edges, a shadow, and scroll nicely on small screens. */}
        <RelativeParent class="flex flex-col max-w-full">
            <div className="-my-2 overflow-x-auto">
                <div className="py-2 align-middle inline-block min-w-full pb-5 sm:px-3 lg:px-4">
                    <div className="shadow-md overflow-hidden border-b border-gray-200 dark:border-gray-800 sm:rounded-lg transition">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                            <thead class="bg-gray-50 dark:bg-gray-800 transition">
                                <HeaderRow openSettings={openSettings} />
                            </thead>
                            <tbody class="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-700 transition">
                                <LocationRow key='here' notes="Local" timezone={here} create={openCreate} />
                                {locations.map((l, i) => <LocationRow key={`${l.timezone}-${i}`} {...l} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </RelativeParent>
    </>
}

function HeaderRow({ openSettings }: { openSettings: () => void }) {
    const times = useAppState(s => s.times)
    const setTime = useAppState(s => s.updateTime)
    const updateTime = (index: number) => (time: TimeOption) => setTime(index, time.time)
    return <tr>

        {/* Settings icon and title */}
        <td scope="col" class={join(classTdHead, 'row space-x-4 py-2')}>
            <button title="Settings" onClick={openSettings} class="flex-shrink-0 -ml-1 rounded focus-ring opacity-50 hover:opacity-100">
                <CogIcon class="w-6 h-6" />
            </button>
            <span>Notes</span>
        </td>

        {/* 'Now' and other times */}
        <td scope="col" class={classTdHeadCenter}>Now</td>
        {times.map((t, i) => <td scope="col" class={classTdHeadCenter} key={t.hour}>
            <HeaderTime time={t} onChange={updateTime(i)} />
        </td>)}
    </tr>
}

/** Renders a time as text but make the selector appear on hover. */
function HeaderTime({ time, onChange }: { time: Time, onChange: (_: TimeOption) => void }) {
    const options = useTimeOptions()
    const option = useFindTimeOption(options, time)
    return <TimeSelector value={option} onChange={onChange} options={options}
        style={SelectorStyle.DashboardTime} classSize='w-full transform translate-x-3' />
}

function LocationRow({ create, ...location }: Location & { create?: () => void }) {
    useTimeUpdater()
    const hereNow = DateTime.now()
    const thereNow = hereNow.setZone(location.timezone)

    const times = useAppState(s => s.times)
    const thereTimes = times.map(({ hour }) => hereNow.set({ hour, minute: 0 }).setZone(location.timezone))

    const [editing, setCreateIsOpen] = useState(false)
    const edit = () => setCreateIsOpen(true)
    const cancel = () => setCreateIsOpen(false)

    return <tr class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden my-3 transition">

        {/* The popup menu */}
        <EditTimezone isOpen={editing} close={cancel} location={location} />

        {/* Hamburger or '+' icon */}
        <td className={classTdBody}>
            <div className="flex items-center -ml-1">
                {create
                    ? <button title="Add timezone" onClick={create}
                        class="flex-shrink-0 rounded focus-ring opacity-50 hover:opacity-100">
                        <PlusIcon class="w-6 h-6" />
                    </button>
                    : <TimezoneMenu location={location} edit={edit} />}
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white transition max-w-xs truncate">{location.notes}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{prettyTimezone(location.timezone)}</div>
                </div>
            </div>
        </td>

        {/* 'Now' and other times */}
        <td class={join(classTdBody, 'text-center')}>{prettyTime(thereNow, hereNow)}</td>
        {thereTimes.map(t => <td class={join(classTdBody, 'text-center')} key={t}>{prettyTime(t)}</td>)}
    </tr>
}

function useOpenClose(): [boolean, () => void, () => void] {
    const [isOpen, setIsOpen] = useState(false)
    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), [])
    return [isOpen, open, close]
}
