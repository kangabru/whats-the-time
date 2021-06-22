import { DateTime } from 'luxon';
import { h } from 'preact';
import { useLocalTimezone } from './selectors/timezone';
import useAppState from '../utils/store';
import { Location } from '../utils/types';
import { join, toTime, useTimeUpdater } from '../utils/utils';
import { MenuIcon } from '@heroicons/react/solid';
import { toTimeOption } from './selectors/time';

const classTdHead = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
const classTdHeadCenter = join(classTdHead, "text-center")
const classTdBody = "px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center"

export default function TimeDashboard() {
    const here = useLocalTimezone()
    const times = useAppState(s => s.times).map(toTimeOption).map(t => t.name)
    const locations = useAppState(s => s.locations)

    return <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow-md overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <td scope="col" class={join(classTdHead, 'pl-16')}>Notes</td>
                                <td scope="col" class={classTdHeadCenter}>Now</td>
                                {times.map(t => <td scope="col" class={classTdHeadCenter} key={t}>{t}</td>)}
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <LocationRow key='here' notes="Local" timezone={here} />
                            {locations.map(l => <LocationRow key={l.timezone} {...l} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
}

function LocationRow(location: Location) {
    useTimeUpdater()
    const thereNow = DateTime.now().setZone(location.timezone)

    const times = useAppState(s => s.times)
    const thereTimes = times.map(({ hour }) => DateTime.now().set({ hour, minute: 0 }).setZone(location.timezone))

    return <tr class="bg-white rounded-lg overflow-hidden my-3">
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <button class="flex-shrink-0">
                    <MenuIcon class="h-6 w-6" />
                </button>
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{location.notes}</div>
                    <div class="text-sm text-gray-500">{location.timezone}</div>
                </div>
            </div>
        </td>
        <td class={classTdBody}>{toTime(thereNow)}</td>
        {thereTimes.map(t => <td class={classTdBody} key={t}>{toTime(t)}</td>)}
    </tr>
}
