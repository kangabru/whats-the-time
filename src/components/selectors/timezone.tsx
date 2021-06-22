import { DateTime } from 'luxon';
import { h, JSX } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import timezones from '../../data/timezones';
import { Timezone } from '../../utils/types';
import Selector, { SelectorProps } from './selector';

export type TimezoneOption = {
    name: string,
    timezone: Timezone,
    disabled?: boolean,
}

export default function useTimezoneSelector(defaultTimezone: Timezone = "UTC"): [JSX.Element, TimezoneOption] {
    const options = useTimezone()
    const [option, setOption] = useState<TimezoneOption>(zoneToOption(defaultTimezone))
    return [<TimezoneSelector value={option} options={options} onChange={setOption} />, option]
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
    const parts = timezone.replace("_", " ").split('/')
    const name = parts.length == 1 ? parts[0] : `${parts[1]} (${parts[0]})`
    return { timezone: timezone, name }
}

type TimezoneSelectorProps = Pick<SelectorProps<TimezoneOption>, 'value' | 'onChange' | 'options'>

function TimezoneSelector(props: TimezoneSelectorProps) {
    return <Selector {...props} repr={r => r.name} />
}

export function useLocalTimezone() {
    return useMemo(() => DateTime.now().zoneName, [])
}