import { h, JSX } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import timezones from '../../data/timezones';
import { Timezone } from '../../utils/types';
import { prettyTimezone } from '../../utils/utils';
import Selector, { SelectorProps, SelectorStyle } from './selector';

const DEFAULT: Timezone = 'UTC'

export type TimezoneOption = {
    name: string,
    timezone: Timezone,
    disabled?: boolean,
}

type TimezoneSelectorProps = Omit<SelectorProps<TimezoneOption>, 'toStr' | 'toKey'>

export default function TimezoneSelector(props: TimezoneSelectorProps) {
    return <Selector<TimezoneOption> {...props} toStr={r => r.name} toKey={r => r.timezone} />
}

export function useTimezoneSelector(defaultTimezone: Timezone = DEFAULT, style?: SelectorStyle): [JSX.Element, TimezoneOption] {
    const args = useTimezoneOptionArgs(defaultTimezone)
    return [<TimezoneSelector {...args} style={style} />, args.value]
}

type TimezoneOptionArgs = Pick<SelectorProps<TimezoneOption>, 'options' | 'value' | 'onChange'>

export function useTimezoneOptionArgs(defaultTimezone: Timezone = DEFAULT): TimezoneOptionArgs {
    const options = useTimezoneOptions()
    const defaultOption = useFindTimezoneOption(options, defaultTimezone)
    const [value, onChange] = useState<TimezoneOption>(defaultOption)
    return { value, onChange, options }
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

export function useFindTimezoneOption(options: TimezoneOption[], timezone: Timezone = "UTC") {
    return useMemo(() => {
        const option = options.find(o => o.timezone === timezone)
        return option ?? zoneToOption(timezone)
    }, [timezone])
}