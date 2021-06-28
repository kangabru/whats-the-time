import InfoIcon from '@heroicons/react/solid/InformationCircleIcon';
import { DateTime } from 'luxon';
import { h } from 'preact';
import useAppState from '../utils/store';
import { join, prettyTime } from '../utils/utils';
import TimeSelector, { useTimeNow, useTimeOptionArgs } from './selectors/time';
import TimezoneSelector, { useTimezoneOptionArgs } from './selectors/timezone';

const classText = "w-full px-2 py-1 text-left"
const classTextTiny = "absolute bottom-full left-4 text-sm"
const classGroup = "px-2 py-1 text-base relative"
const classSelect = "w-full"

/** Renders the 'convert time' page section. */
export default function TimeConverter() {
    const now = useTimeNow()

    // Values for: What's the time in <New York> when it's <10am> in <London>?
    const zoneArgsIn = useTimezoneOptionArgs("America/New_York")
    const zoneArgsWhen = useTimezoneOptionArgs(useAppState(s => s.timezone)) // default to local
    const timeArgsWhen = useTimeOptionArgs(now)

    // Prepare the time in the one timezone then convert to the other zone
    const timeWhen = DateTime.fromObject({ zone: zoneArgsWhen.value.timezone, hour: timeArgsWhen.value.time.hour, minute: 0, second: 0 })
    const timeIn = timeWhen.setZone(zoneArgsIn.value.timezone)

    return <div class="col m-5 ">
        <div class="max-w-sm">

            {/* What's the time? */}
            <h1 class={join(classText, 'text-center text-4xl font-extrabold mb-10')}>What's the time?</h1>

            {/* in New York */}
            <div class={classGroup}>
                <div class={classTextTiny}>in</div>
                <a title="Timezone info" target="_blank"
                    class="absolute bottom-full right-3 text-gray-800 dark:text-white opacity-80 hover:opacity-100 rounded-full focus-ring"
                    href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones">
                    <InfoIcon class="w-5 h-5" />
                </a>
                <TimezoneSelector {...zoneArgsIn} classSize={classSelect} />
            </div>

            {/* when it's 10am in London */}
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

            {/* 5pm */}
            <div colSpan={2} class={join(classText, 'w-full mt-6 text-4xl text-center font-extrabold')}>
                <span>{prettyTime(timeIn, timeWhen)}</span>
            </div>

        </div>
    </div>
}
