import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import timezones from '../../data/timezones';
import { Timezone } from '../../utils/types';
import { prettyTimezone } from '../../utils/utils';
import Selector, { SelectorProps } from './selector';

const DEFAULT: Timezone = 'UTC'

export type TimezoneOption = {
    name: string,
    timezone: Timezone,
    disabled?: boolean,
}

type TimezoneSelectorProps = Omit<SelectorProps<TimezoneOption>, 'toStr' | 'toKey'>

/** A listbox that shows all timezone options. */
export default function TimezoneSelector(props: TimezoneSelectorProps) {
    return <Selector<TimezoneOption> {...props} toStr={r => r.name} toKey={r => r.timezone} />
}

type TimezoneOptionArgs = Pick<SelectorProps<TimezoneOption>, 'options' | 'value' | 'onChange'>

/**
 * Prepares some {@link TimezoneSelector} arguments.
 * @param defaultTimezone - The initial timezone value to set the listbox value as.
 */
export function useTimezoneOptionArgs(defaultTimezone: Timezone = DEFAULT): TimezoneOptionArgs {
    const options = useTimezoneOptions()
    const defaultOption = useFindTimezoneOption(options, defaultTimezone)
    const [value, onChange] = useState<TimezoneOption>(defaultOption)
    return { value, onChange, options }
}

/** Prepares and caches the timezone options with human readable names. */
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

/** The listbox matches options by reference so this hook helps to find that value and cache the reference. */
export function useFindTimezoneOption(options: TimezoneOption[], timezone: Timezone = "UTC") {
    return useMemo(() => {
        const option = options.find(o => o.timezone === timezone)
        return option ?? zoneToOption(timezone)
    }, [timezone])
}
