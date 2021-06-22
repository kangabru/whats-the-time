import { DateTime } from 'luxon';
import { h } from 'preact';
import { useLocalTimezone } from '../selectors/timezone';
import useAppState from '../utils/store';
import { Location } from '../utils/types';
import { toTime } from '../utils/utils';

export default function TimeDashboard() {
    const here = useLocalTimezone()
    const times = useAppState(s => s.times)
    const locations = useAppState(s => s.locations)

    return <table>
        <thead>
            <tr>
                <td class="px-3 py-2">Notes</td>
                <td class="px-3 py-2">Now</td>
                {times.map(t => <td class="px-3 py-2" key={t}>{t}</td>)}
            </tr>
        </thead>
        <tbody>
            <LocationRow key='here' notes="Local" timezone={here} />
            {locations.map(l => <LocationRow key={l.timezone} {...l} />)}
        </tbody>
    </table>
}

function LocationRow(location: Location) {
    const thereNow = DateTime.now().setZone(location.timezone)

    const times = useAppState(s => s.times)
    const thereTimes = times.map(({ hour }) => DateTime.now().set({ hour }).setZone(location.timezone))

    return <tr>
        <td class="px-3 py-2">{location.notes}</td>
        <td class="px-3 py-2">{toTime(thereNow)}</td>
        {thereTimes.map(t => <td class="px-3 py-2" key={t}>{toTime(t)}</td>)}
    </tr>
}
