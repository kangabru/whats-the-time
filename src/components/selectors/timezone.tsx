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
    const options = useTimezoneOptions()
    const defaultOption = useTimezoneOption(options, defaultTimezone)
    const [option, setOption] = useState<TimezoneOption>(defaultOption)
    return [
        <Selector<TimezoneOption>
            options={options} value={option} onChange={setOption}
            style={style} toStr={r => r.name} toKey={r => r.timezone}
        />,
        option
    ]
}

export function useTimezoneOptions(): TimezoneOption[] {
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

export function useTimezoneOption(options: TimezoneOption[], timezone: Timezone = "UTC") {
    return useMemo(() => {
        const option = options.find(o => o.timezone === timezone)
        return option ?? zoneToOption(timezone)
    }, [timezone])
}