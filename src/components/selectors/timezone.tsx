import { DateTime } from 'luxon';
import { h, JSX } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import timezones from '../../data/timezones';
import { Timezone } from '../../utils/types';
import { prettyTimezone } from '../../utils/utils';
import Selector, { SelectorStyle } from './selector';

export type TimezoneOption = {
    name: string,
    timezone: Timezone,
    disabled?: boolean,
}

export default function useTimezoneSelector(defaultTimezone: Timezone = "UTC", style?: SelectorStyle): [JSX.Element, TimezoneOption] {
    const options = useTimezone()
    const [option, setOption] = useState<TimezoneOption>(zoneToOption(defaultTimezone))
    return [
        <Selector
            options={options} value={option} onChange={setOption}
            style={style} repr={r => r.name}
        />,
        option
    ]
}

function useTimezone(): TimezoneOption[] {
    return useMemo(() => Object.entries(timezones)
        .map(([groupName, groupZones]) => groupToOptions(groupName, groupZones))
        .reduce((result, group) => [...result, ...group], [])
        , [])
}

function groupToOptions(name: string, timezones: Timezone[]): TimezoneOption[] {
    const groupOption: TimezoneOption = { name, timezone: "", disabled: true }
    return [groupOption, ...timezones.map(zoneToOption)]
}

function zoneToOption(timezone: Timezone): TimezoneOption {
    return { timezone, name: prettyTimezone(timezone) }
}

export function useLocalTimezone() {
    return useMemo(() => DateTime.now().zoneName, [])
}