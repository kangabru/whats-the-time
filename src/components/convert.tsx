import InfoIcon from '@heroicons/react/solid/InformationCircleIcon';
import { DateTime } from 'luxon';
import { h } from 'preact';
import useAppState from '../utils/store';
import { join, prettyTime } from '../utils/utils';
import TimeSelector, { useTimeNow, useTimeOptionArgs } from './selectors/time';
import TimezoneSelector, { useTimezoneOptionArgs } from './selectors/timezone';

export default function TimeConverter() {
    const now = useTimeNow()
    const here = useAppState(s => s.timezone)

    const zoneArgsIn = useTimezoneOptionArgs("America/New_York")
    const zoneArgsWhen = useTimezoneOptionArgs(here)
    const timeArgsWhen = useTimeOptionArgs(now)

    const _timeWhen = DateTime.fromObject({ zone: zoneArgsWhen.value.timezone, hour: timeArgsWhen.value.time.hour, minute: 0, second: 0 })
    const _timeIn = _timeWhen.setZone(zoneArgsIn.value.timezone)

    const classText = "w-full px-2 py-1 text-left"
    const classTextTiny = "absolute bottom-full left-4 text-sm"
    const classGroup = "px-2 py-1 text-base relative"
    const classSelect = "w-full"

    // e.g. Time in New York when 10 pm in Londong
    return <div class="col m-5 ">
        <div class="max-w-sm">

            <h1 class={join(classText, 'text-center text-4xl font-extrabold mb-10')}>What's the time?</h1>

            <div class={classGroup}>
                <div class={classTextTiny}>in</div>
                <a title="Timezone info" target="_blank"
                    class="absolute bottom-full right-3 opacity-60 hover:opacity-100 rounded-full focus-ring"
                    href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones">
                    <InfoIcon class="w-5 h-5" />
                </a>
                <TimezoneSelector {...zoneArgsIn} classSize={classSelect} />
            </div>

            <div class="space-y-6 mt-14">
                <div class={classGroup}>
                    <div class={classTextTiny}>when it's</div>
                    <TimeSelector {...timeArgsWhen} classSize={classSelect} />
                </div>

                <div class={classGroup}>
                    <div class={classTextTiny}>in</div>
                    <TimezoneSelector {...zoneArgsWhen} classSize={classSelect} />
                </div>
            </div>

            <div colSpan={2} class={join(classText, 'w-full mt-6 text-4xl text-center font-extrabold')}>
                <span>{prettyTime(_timeIn, _timeWhen)}</span>
            </div>

        </div>
    </div>
}
