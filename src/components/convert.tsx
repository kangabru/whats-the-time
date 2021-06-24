import { DateTime } from 'luxon';
import { h } from 'preact';
import useAppState from '../utils/store';
import { join, prettyTime } from '../utils/utils';
import useTimeSelector, { useNow as useLocalNow } from './selectors/time';
import { useTimezoneSelector } from './selectors/timezone';

export default function TimeConverter() {
    const now = useLocalNow()
    const here = useAppState(s => s.timezone)

    const [selectorTimezoneIn, timezoneIn] = useTimezoneSelector("America/New_York")
    const [selectorTimezoneWhen, timezoneWhen] = useTimezoneSelector(here)
    const [selectorTimeWhen, timeWhen] = useTimeSelector(now)

    const _timeWhen = DateTime.fromObject({ zone: timezoneWhen.timezone, hour: timeWhen.time.hour, minute: 0, second: 0 })
    const _timeIn = _timeWhen.setZone(timezoneIn.timezone)

    const classText = "w-full px-2 py-1 text-left"
    const classTextTiny = "absolute bottom-full -left-4 text-sm"
    const classSelect = "px-2 py-1 text-base relative"

    // e.g. Time in New York when 10 pm in Londong
    return <div class="col px-5 m-5">

        <h2 class={join(classText, 'text-center text-4xl font-extrabold mb-10')}>What's the time?</h2>

        <div class={classSelect}>
            <div class={classTextTiny}>in</div>
            {selectorTimezoneIn}
        </div>

        <div class="space-y-4 mt-14">
            <div class={classSelect}>
                <div class={classTextTiny}>when it's</div>
                {selectorTimeWhen}
            </div>

            <div class={classSelect}>
                <div class={classTextTiny}>in</div>
                {selectorTimezoneWhen}
            </div>
        </div>

        <div colSpan={2} class={join(classText, 'w-full mt-6 text-4xl text-center font-extrabold')}>
            <span>{prettyTime(_timeIn, _timeWhen)}</span>
        </div>

    </div>
}
