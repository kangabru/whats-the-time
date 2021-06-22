import { DateTime } from 'luxon';
import { h } from 'preact';
import useTimeSelector, { useNow as useLocalNow } from './selectors/time';
import useTimezoneSelector, { useLocalTimezone } from './selectors/timezone';
import { toTime } from '../utils/utils';

export default function TimeConverter() {
    const now = useLocalNow()
    const here = useLocalTimezone()

    const [selectorTimezoneIn, timezoneIn] = useTimezoneSelector("America/New_York")
    const [selectorTimezoneWhen, timezoneWhen] = useTimezoneSelector(here)
    const [selectorTimeWhen, timeWhen] = useTimeSelector(now)

    const _timeWhen = DateTime.fromObject({ zone: timezoneWhen.timezone, hour: timeWhen.time.hour, minute: 0, second: 0 })
    const _timeIn = _timeWhen.setZone(timezoneIn.timezone)

    // e.g. Time in New York when 10 pm in Londong
    return <table>
        <tbody>
            <tr>
                <td class="px-2 py-1 text-center">Time in</td>
                <td class="px-2 py-1">{selectorTimezoneIn}</td>
            </tr>
            <tr>
                <td class="px-2 py-1 text-center">when</td>
                <td class="px-2 py-1">{selectorTimeWhen}</td>
            </tr>
            <tr>
                <td class="px-2 py-1 text-center">in</td>
                <td class="px-2 py-1">{selectorTimezoneWhen}</td>
            </tr>
            <tr>
                <td colSpan={2} class="px-2 py-1 text-center">
                    <hr class="w-full my-2 border-t-2 border-gray-200" />
                    <span>{toTime(_timeIn, _timeWhen)}</span>
                </td>
            </tr>
        </tbody>
    </table>
}
